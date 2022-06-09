import React, { useCallback, useContext, useEffect, useState } from 'react';
import '../../pages/AdminSettings/Currency/style.scss';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, FormControl, FormHelperText, TextField } from '@mui/material';
import moment from 'moment';
import isEmpty from 'lodash.isempty';
import useFetch from '../../../hooks/useFetch';
import CurrenciesService from '../../../services/CURRENCIES/CurrenciesService';
import ModalWindow from '../ModalWindow/ModalWindow';
import { DashboardContext } from '../DashboardContext';
import useIsMounted from '../../../hooks/useIsMounted';
import { isNull } from '../../../utils/isNull';

const AddCurrency = ({ open, onClose, selectedCur, selectedDate }) => {
  const isMounted = useIsMounted();
  const { fetchCurrencies } = useContext(DashboardContext);
  const [curData, setCurData] = useState({});
  const [isDataSetted, setIsDataSetted] = useState(false);
  const [date, setDate] = useState(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      setRequestSubmitted(false);
    }
  }, [isMounted]);

  useEffect(() => {
    if (isEmpty(curData)) {
      setCurData(selectedCur);
    }
  }, [curData, selectedCur]);

  useEffect(() => {
    if (isNull(date)) {
      setDate(selectedDate);
    }
  }, [date, selectedDate]);

  const onGetResponse = useCallback((response) => {
    if (!response.message) {
      onClose();
      fetchCurrencies({ date: moment().format('YYYY-MM-DD') });
      setRequestSubmitted(true);
    }
  }, [fetchCurrencies, onClose]);

  const { fetch: fetchNewCurrency } = useFetch({
    requestFunction: CurrenciesService.postRequest,
    setResponse: onGetResponse
  });

  const { fetch: fetchEditCurrency } = useFetch({
    requestFunction: CurrenciesService.putWithoutIdRequest,
    setResponse: onGetResponse
  });

  const submitForm = useCallback((value) => {
    if (isEmpty(curData)) {
      fetchNewCurrency(value);
    }
    if (!isEmpty(curData)) {
      const { id } = curData;
      const { title, sellRate, buyRate } = value;
      fetchEditCurrency({
        data: [
          {
            buyRate,
            sellRate,
            currency_id: id,
            currency_title: title,
            date: moment(date).format('YYYY-MM-DD')
          }
        ]
      });
    }
  }, [curData, date, fetchEditCurrency, fetchNewCurrency]);

  const formik = useFormik({
    initialValues: {
      title: '',
      buyRate: '',
      sellRate: ''
    },
    validationSchema: yup.object({
      title: yup
        .string()
        .matches(
          /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
          'Только латинские символы'
        )
        .max(3, 'Не более 3 символов')
        .required('Обязательно к заполнению'),
      buyRate: yup
        .number()
        .transform((_value, originalValue) => Number(originalValue.replace(/,/, '.')))
        .max(999.999, 'Максимальное значение 999.999')
        .typeError('Поле должно содержать только цифры')
        .positive('Число должно быть больше 0')
        .required('Обязательно к заполнению'),
      sellRate: yup
        .number()
        .transform((_value, originalValue) => Number(originalValue.replace(/,/, '.')))
        .max(999.999, 'Максимальное значение 999.999')
        .typeError('Поле должно содержать только цифры')
        .positive('Число должно быть больше 0')
        .required('Обязательно к заполнению')
    }),
    onSubmit: (values, { resetForm }) => {
      submitForm(values);
      resetForm();
    }
  });

  useEffect(() => {
    if (isMounted.current) {
      if (!isEmpty(curData) && !isDataSetted) {
        setIsDataSetted(true);

        if (isEmpty(formik.values.title)) {
          formik.values.title = curData.title;
        }
        if (isEmpty(formik.values.sellRate)) {
          formik.values.sellRate = curData.rate[0].sellRate;
        }
        if (isEmpty(formik.values.buyRate)) {
          formik.values.buyRate = curData.rate[0].buyRate;
        }
      }
    }
  }, [curData, formik, isMounted, setIsDataSetted, isDataSetted]);

  const cleanForm = useCallback(() => {
    formik.values.title = '';
    formik.values.buyRate = '';
    formik.values.sellRate = '';
  }, [formik]);

  useEffect(() => {
    if (requestSubmitted) {
      cleanForm();
      setRequestSubmitted(false);
    }
  }, [requestSubmitted, cleanForm]);

  const onClickReset = useCallback(() => {
    setIsDataSetted(false);
    setCurData({});
    cleanForm();
    formik.resetForm();
    onClose();
  }, [cleanForm, formik, onClose]);

  return (
    <ModalWindow
      open={open}
      onClose={onClose}
      maxWidth="700px"
      onBackdropClick={onClickReset}
    >
      <div className="addCurrency">
        <form onSubmit={formik.handleSubmit}>
          <FormControl size="small" fullWidth>
            <TextField
              id="title"
              name="title"
              size="small"
              label="Название валюты *"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Введите название валюты"
              error={formik.touched.title && Boolean(formik.errors.title)}
            />
            {(formik.touched.title && formik.errors.title) && (
              <FormHelperText error>{formik.errors.title}</FormHelperText>)}
          </FormControl>
          <FormControl size="small" fullWidth>
            <TextField
              id="buyRate"
              name="buyRate"
              size="small"
              label="Покупка *"
              value={formik.values.buyRate}
              onChange={formik.handleChange}
              placeholder="Покупка"
              error={formik.touched.buyRate && Boolean(formik.errors.buyRate)}
            />
            {(formik.touched.buyRate && formik.errors.buyRate) && (
              <FormHelperText error>{formik.errors.buyRate}</FormHelperText>)}
          </FormControl>
          <FormControl size="small" fullWidth>
            <TextField
              id="sellRate"
              name="sellRate"
              size="small"
              label="Продажа *"
              value={formik.values.sellRate}
              onChange={formik.handleChange}
              placeholder="Продажа"
              error={formik.touched.sellRate && Boolean(formik.errors.sellRate)}
            />
            {(formik.touched.sellRate && formik.errors.sellRate) && (
              <FormHelperText error>{formik.errors.sellRate}</FormHelperText>)}
          </FormControl>
          <div className="addUsers-actions">
            <Button variant="contained" type="submit">Сохранить</Button>
            <Button type="reset" onClick={() => onClickReset()}>Отмена</Button>
          </div>
        </form>
      </div>
    </ModalWindow>
  );
};
AddCurrency.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  selectedCur: PropTypes.object,
  selectedDate: PropTypes.instanceOf(Date)
};

export default AddCurrency;
