import React, { useEffect, useContext, useState, useCallback, useRef } from 'react';
import './style.scss';
import PropTypes from 'prop-types';
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
import validationSchemaSellBuy from './validateForm';
import PageWrapper from '../../common/PageWrapper/PageWrapper';
import { CashierContext } from '../../components/CashierContext';
import { AuthorisationContext } from '../../components/AuthorisationContext';
import { isUndefined } from '../../../utils/isUndefined';
import ModalWindowCashierConfirm from '../../components/ModalWindowCashierConfirm/ModalWindowCashierConfirm';

const BuyAndSellPage = ({ isBuy }) => {
  const { cashierData } = useContext(AuthorisationContext);
  const {
    cashierCurrency,
    fetchCashierCurrency
  } = useContext(CashierContext);
  const [isEdit, setIsEdit] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const ourCur = isUndefined(cashierCurrency.find((item) => item.title === 'UAH'))
    ? null
    : cashierCurrency.find((item) => item.title === 'UAH').id;

  const onClickOpenConfirm = useCallback(() => setIsOpenModal(true), []);
  const onHandleCloseConfirm = useCallback(() => setIsOpenModal(false), []);

  const formData = useRef({});

  const onSubmitForm = useCallback((values) => {
    const { currencyTitle, currencyValue, sum, totalCash, comment } = values;
    onClickOpenConfirm();
    const operationType = isBuy ? 'Покупка' : 'Продажа';
    const arriveCurr = isBuy ? currencyTitle : ourCur;
    const expCurr = isBuy ? ourCur : currencyTitle;

    formData.current = {
      storno: 'Нет',
      arrival_value: sum,
      rate: currencyValue,
      expense_currency_id: expCurr,
      operation_type: operationType,
      arrival_currency_id: arriveCurr,
      expense_value: Number(totalCash),
      comment
    };
  }, [ourCur, isBuy, onClickOpenConfirm]);

  const formik = useFormik({
    initialValues: {
      currencyTitle: '',
      currencyValue: '',
      sum: '',
      totalCash: '',
      comment: ''
    },
    validationSchema: validationSchemaSellBuy,
    onSubmit: (values) => {
      onSubmitForm(values);
    }
  });

  const onResetForm = useCallback(() => {
    formik.resetForm();
  }, [formik]);

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

  const renderCurrencies = useCallback(() => {
    if (isEmpty(cashierCurrency)) {
      return null;
    }
    if (!isEmpty(cashierCurrency)) {
      return cashierCurrency.map((item) => (
        <MenuItem key={nanoid()} value={item.id}>{item.title}</MenuItem>
      ));
    }
  }, [cashierCurrency]);

  const handelEditField = () => {
    setIsEdit((prevState) => !prevState);
  };
  const totalCash = () => {
    if (formik.values.sum && formik.values.currencyValue) {
      const totalSum = isBuy
        ? formik.values.sum / +formik.values.currencyValue
        : formik.values.sum * +formik.values.currencyValue;
      return totalSum.toFixed(2);
    } return '';
  };

  return (
    <PageWrapper>
      <div className="buy-sell-page-title">{isBuy ? 'Покупка' : 'Продажа'}</div>
      <form className="buy-sell-page-form" onSubmit={formik.handleSubmit}>
        <div className="buy-sell-page-input">
          <div className="addUsers-two cross-course-two-inputs">
            <FormControl fullWidth size="normal">
              <InputLabel>Валюта</InputLabel>
              <Select
                required
                autoWidth
                className="buy-sell-page-currencyTitle"
                id="currencyTitle"
                name="currencyTitle"
                label="Валюта"
                placeholder="Валюта"
                value={formik.values.currencyTitle}
                MenuProps={MenuProps}
                onChange={(e) => {
                  formik.values.currencyValue = cashierCurrency.find((item) => (
                    item.id === e.target.value
                  ))[isBuy ? 'buyRate' : 'sellRate'];
                  formik.handleChange(e);
                  formik.values.totalCash = totalCash();
                }}
              >
                {renderCurrencies()}
              </Select>
              {(formik.touched.currencyTitle && formik.errors.currencyTitle) && (
              <FormHelperText error>{formik.errors.currencyTitle}</FormHelperText>)}
            </FormControl>
            <FormControl fullWidth size="normal">
              <TextField
                type="number"
                disabled={!isEdit}
                InputProps={{
                  endAdornment: <InputAdornment position="end"><IconButton onClick={handelEditField} disabled={!formik.values.currencyValue}><EditRoundedIcon color={isEdit ? 'primary' : 'disabled'} /></IconButton></InputAdornment>,
                  inputProps: {
                    min: 0,
                    step: 0.01
                  }
                }}
                required
                id="currencyValue"
                name="currencyValue"
                label={`Курс на ${moment().format('D.MM.YYYY')}`}
                value={formik.values.currencyValue}
                onChange={(e) => {
                  formik.values.currencyValue = e.target.value;
                  formik.handleChange(e);
                  formik.values.totalCash = totalCash();
                }}
              />
              {(formik.touched.currencyValue && formik.errors.currencyValue) && (
                <FormHelperText error>{formik.errors.currencyValue}</FormHelperText>)}
            </FormControl>
          </div>
        </div>
        <div className="buy-sell-page-input">
          <div className="addUsers-two cross-course-two-inputs">
            <FormControl fullWidth size="normal">
              <TextField
                required
                id="sum"
                name="sum"
                label="Сумма"
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {isBuy
                        ? 'UAH'
                        : !isUndefined(cashierCurrency.find((item) => item.id === formik.values.currencyTitle))
                        && cashierCurrency.find((item) => (
                          item.id === formik.values.currencyTitle
                        )).title.toUpperCase()}
                    </InputAdornment>
                  ),
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
              />
              {(formik.touched.sum && formik.errors.sum) && (
                <FormHelperText error>{formik.errors.sum}</FormHelperText>)}
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
                  inputProps: {
                    min: 0
                  }
                }}
                value={formik.values.totalCash}
                onChange={formik.handleChange}
              />
              {(formik.touched.totalCash && formik.errors.totalCash) && (
                <FormHelperText error>{formik.errors.totalCash}</FormHelperText>)}
            </FormControl>
          </div>
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
        <div className="addUsers-actions">
          <Button variant="contained" type="submit">Провести</Button>
        </div>
      </form>
      <ModalWindowCashierConfirm
        open={isOpenModal}
        reset={onResetForm}
        data={formData.current}
        handleClose={onHandleCloseConfirm}
      />
    </PageWrapper>
  );
};

BuyAndSellPage.propTypes = {
  isBuy: PropTypes.bool
};

export default BuyAndSellPage;
