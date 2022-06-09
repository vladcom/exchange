import React, { useEffect, useContext, useState, useCallback } from 'react';
import './style.scss';
import isEmpty from 'lodash.isempty';
import {
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  IconButton,
  InputLabel,
  InputAdornment,
  Select,
  TextField
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useFormik } from 'formik';
import moment from 'moment';
import { nanoid } from 'nanoid';
import validationSchemaCross from './validateForm';
import PageWrapper from '../../common/PageWrapper/PageWrapper';
import { CashierContext } from '../../components/CashierContext';
import { AuthorisationContext } from '../../components/AuthorisationContext';
import AlertSnackbar from '../../common/Snackbar/AlertSnackbar';
import { isUndefined } from '../../../utils/isUndefined';
import OperationsService from '../../../services/OPERATIONS/OperationsService';
import useFetch from '../../../hooks/useFetch';

const CrossCoursePage = () => {
  const { cashierData } = useContext(AuthorisationContext);
  const { cashierCurrency, fetchCashierCurrency } = useContext(CashierContext);
  const [isEdit, setIsEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (isOpenSnackbar) {
        setIsOpenSnackbar(false);
      }
    }, 5000);

    return () => clearTimeout();
  }, [isOpenSnackbar]);

  const onGetResponse = useCallback((res) => {
    if (!res.success) {
      if (res.message === 'Validation Error.') {
        const message = Object.values(res.data).join(', ');
        setErrorMessage(message);
        return null;
      }
      setErrorMessage(res.message);
    }
    if (res.data) {
      setErrorMessage('');
      setIsOpenSnackbar(true);
    }
  }, []);

  const { fetch: fetchSellBuyOperation } = useFetch({
    requestFunction: OperationsService.postRequest,
    setResponse: onGetResponse
  });

  const onSubmitForm = useCallback((values) => {
    const { currencyTitleBuy, currencyTitleSell, comment, crossCourse, sum, totalCash } = values;
    const data = {
      comment: !isUndefined(comment) ? comment : '',
      storno: 'Нет',
      rate: crossCourse,
      arrival_value: Number(sum),
      operation_type: 'Кросс-курс',
      expense_value: Number(totalCash),
      expense_currency_id: currencyTitleSell,
      arrival_currency_id: currencyTitleBuy
    };

    fetchSellBuyOperation(data);
  }, [fetchSellBuyOperation]);

  const formik = useFormik({
    initialValues: {
      currencyTitleBuy: '',
      sum: '',
      currencyTitleSell: '',
      crossCourse: '',
      totalCash: '',
      comment: ''
    },
    validationSchema: validationSchemaCross,
    onSubmit: (values, { resetForm }) => {
      onSubmitForm(values);
      resetForm();
    }
  });

  useEffect(() => {
    fetchCashierCurrency({
      department_id: cashierData.id,
      date: moment().format('YYYY-MM-DD'),
      id: cashierData.id
    });
  }, [fetchCashierCurrency, cashierData]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.2 + ITEM_PADDING_TOP,
        width: 231
      }
    }
  };

  const renderCurrencies = useCallback((isBuy = true) => {
    const disabledItem = isBuy ? formik.values.currencyTitleSell : formik.values.currencyTitleBuy;
    if (isEmpty(cashierCurrency)) {
      return null;
    }
    if (!isEmpty(cashierCurrency)) {
      return cashierCurrency.map((item) => (
        <MenuItem key={nanoid()} value={item.id} disabled={item.id === disabledItem}>{item.title}</MenuItem>
      ));
    }
  }, [formik, cashierCurrency]);

  const handelEditField = () => {
    setIsEdit((prevState) => !prevState);
  };
  const totalCash = () => {
    if (formik.values.sum && formik.values.currencyTitleBuy && formik.values.currencyTitleSell) {
      const totalSum = formik.values.sum * formik.values.crossCourse;
      return totalSum.toFixed(2);
    } return '';
  };
  const crossCourse = () => {
    if (formik.values.currencyTitleBuy && formik.values.currencyTitleSell) {
      const currencyTitleBuyRate = cashierCurrency.find((item) => (
        item.id === formik.values.currencyTitleBuy
      )).buyRate;
      const currencyTitleSellRate = cashierCurrency.find((item) => (
        item.id === formik.values.currencyTitleSell
      )).sellRate;
      const totalSum = currencyTitleBuyRate / currencyTitleSellRate;
      return totalSum.toFixed(5);
    } return '';
  };

  const adornmentTitle = (id) => {
    if (id) {
      return cashierCurrency.find((item) => item.id === id).title.toLocaleLowerCase();
    } return null;
  };

  return (
    <PageWrapper>
      <div className="buy-sell-page-title">Кросс-курс</div>
      <form className="buy-sell-page-form" onSubmit={formik.handleSubmit}>
        <div className="buy-sell-page-input">
          <div className="addUsers-two cross-course-two-inputs">
            <FormControl fullWidth size="normal">
              <InputLabel>На приход:</InputLabel>
              <Select
                required
                autoWidth
                id="currencyTitleBuy"
                name="currencyTitleBuy"
                label="На приход:"
                placeholder="На приход"
                value={formik.values.currencyTitleBuy}
                MenuProps={MenuProps}
                onChange={(e) => {
                  formik.values.currencyTitleBuy = e.target.value;
                  formik.values.crossCourse = crossCourse();
                  formik.values.totalCash = totalCash();
                  formik.handleChange(e);
                }}
                error={formik.touched.currencyTitleBuy && Boolean(formik.errors.currencyTitleBuy)}
              >
                {renderCurrencies(true)}
              </Select>
              {(formik.touched.currencyTitle && formik.errors.currencyTitle) && (
              <FormHelperText error>{formik.errors.currencyTitle}</FormHelperText>)}
            </FormControl>
            <FormControl fullWidth size="normal">
              <TextField
                required
                id="sum"
                name="sum"
                label="Сумма"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{adornmentTitle(formik.values.currencyTitleBuy)}</InputAdornment>,
                  inputProps: {
                    min: 0
                  }
                }}
                value={formik.values.sum}
                onChange={(e) => {
                  formik.values.sum = e.target.value;
                  formik.handleChange(e);
                  formik.values.totalCash = totalCash();
                }}
                error={formik.touched.sum && Boolean(formik.errors.sum)}
                helperText={formik.touched.sum && formik.errors.sum}
              />
            </FormControl>
          </div>
        </div>
        <div className="buy-sell-page-input">
          <div className="addUsers-two cross-course-two-inputs">
            <FormControl fullWidth size="normal">
              <InputLabel>На расход:</InputLabel>
              <Select
                required
                autoWidth
                id="currencyTitleSell"
                name="currencyTitleSell"
                label="На расход:"
                placeholder="На расход"
                value={formik.values.currencyTitleSell}
                MenuProps={MenuProps}
                onChange={(e) => {
                  formik.values.currencyTitleSell = e.target.value;
                  formik.values.crossCourse = crossCourse();
                  formik.handleChange(e);
                  formik.values.totalCash = totalCash();
                }}
                error={formik.touched.currencyTitleSell && Boolean(formik.errors.currencyTitleSell)}
              >
                {renderCurrencies(false)}
              </Select>
              {(formik.touched.currencyTitle && formik.errors.currencyTitle) && (
              <FormHelperText error>{formik.errors.currencyTitle}</FormHelperText>)}
            </FormControl>
            <FormControl fullWidth size="normal">
              <TextField
                className="buy-sell-page-totalCash"
                disabled
                id="totalCash"
                name="totalCash"
                label="Итог:"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{adornmentTitle(formik.values.currencyTitleSell)}</InputAdornment>,
                  inputProps: {
                    min: 0
                  }
                }}
                value={formik.values.totalCash}
                onChange={formik.handleChange}
                error={formik.touched.totalCash && Boolean(formik.errors.totalCash)}
                helperText={formik.touched.totalCash && formik.errors.totalCash}
              />
            </FormControl>
          </div>
        </div>
        <div className="buy-sell-page-input">
          <FormControl fullWidth size="normal">
            <TextField
              type="number"
              disabled={!isEdit}
              InputProps={{
                endAdornment: <InputAdornment position="end"><IconButton onClick={handelEditField}><EditRoundedIcon color={isEdit ? 'primary' : 'disabled'} /></IconButton></InputAdornment>,
                inputProps: {
                  min: 0
                }
              }}
              required
              id="CrossCourse"
              name="CrossCourse"
              label={`Кросс-курс на ${moment().format('D.MM.YYYY')}`}
              value={formik.values.crossCourse}
              onChange={(e) => {
                formik.values.crossCourse = e.target.value;
                formik.handleChange(e);
                formik.values.totalCash = totalCash();
              }}
              error={formik.touched.crossCourse && Boolean(formik.errors.crossCourse)}
              helperText={formik.touched.crossCourse && formik.errors.crossCourse}
            />
          </FormControl>
        </div>
        <div className="buy-sell-page-input">
          <FormControl fullWidth size="normal">
            <TextField
              type="text"
              multiline
              rows={4}
              id="comment"
              name="comment"
              label="Комментарий"
              value={formik.values.comment}
              onChange={formik.handleChange}
              error={formik.touched.comment && Boolean(formik.errors.comment)}
              helperText={formik.touched.comment && formik.errors.comment}
            />
          </FormControl>
        </div>
        {!errorMessage.length ? null : <p className="errorText">{errorMessage}</p>}
        <div className="addUsers-actions">
          <Button variant="contained" type="submit">
            Провести
          </Button>
        </div>
      </form>
      <AlertSnackbar isOpen={isOpenSnackbar} success message="Операция проведена успешно" />
    </PageWrapper>
  );
};

export default CrossCoursePage;
