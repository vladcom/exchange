import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Button, FormControl, FormHelperText, TextField } from '@mui/material';
import * as yup from 'yup';
import isEmpty from 'lodash.isempty';
import useFetch from '../../../hooks/useFetch';
import CitiesService from '../../../services/CITIES/CitiesService';
import ModalWindow from '../ModalWindow/ModalWindow';
import { DashboardContext } from '../DashboardContext';
import useIsMounted from '../../../hooks/useIsMounted';

const AddCities = ({
  open,
  handleClose,
  selectedCity,
  errorMessage,
  setErrorMessage
}) => {
  const isMounted = useIsMounted();
  const { fetchCities } = useContext(DashboardContext);
  const [cityData, setCityData] = useState({});
  const [isDataSetted, setIsDataSetted] = useState(false);

  useEffect(() => {
    if (isEmpty(cityData)) {
      setCityData(selectedCity);
    }
  }, [cityData, selectedCity]);

  const onGetResponse = useCallback((response) => {
    if (!response.message) {
      setErrorMessage('');
      handleClose();
      fetchCities();

      if (!isEmpty(selectedCity)) {
        setIsDataSetted(true);
      }
    }
    if (response.message) {
      setErrorMessage('Город уже существует');
    }
  }, [handleClose, setIsDataSetted, selectedCity, fetchCities, setErrorMessage]);

  const { fetch: fetchAddCities, loading: isFetchingNewCities } = useFetch({
    requestFunction: CitiesService.postRequest,
    setResponse: onGetResponse,
    withLoading: true
  });

  const { fetch: fetchEditCities, loading: isFetchingEditCities } = useFetch({
    requestFunction: CitiesService.putRequest,
    setResponse: onGetResponse,
    withLoading: true
  });

  const submitForm = useCallback((value) => {
    const { title } = value;
    if (!isEmpty(value)) {
      if (isEmpty(selectedCity)) {
        fetchAddCities({ title });
      }
      if (!isEmpty(selectedCity)) {
        fetchEditCities({ id: cityData.id, title });
      }
    }
  }, [selectedCity, cityData, fetchEditCities, fetchAddCities]);

  const formik = useFormik({
    initialValues: {
      title: ''
    },
    validationSchema: yup.object({
      title: yup
        .string()
        .max(48, 'Не более 48 символов')
        .required('Обязательно к заполнению')
    }),
    onSubmit: (values, { resetForm }) => {
      submitForm(values);
      resetForm();
    }
  });

  useEffect(() => {
    if (isMounted.current) {
      if (!isEmpty(cityData) && !isDataSetted) {
        setIsDataSetted(true);

        if (isEmpty(formik.values.title)) {
          formik.values.title = cityData.title;
        }
      }
    }
  }, [cityData, formik, isMounted, setIsDataSetted, isDataSetted]);

  const onClickReset = () => {
    formik.resetForm();
    setIsDataSetted(false);
    setCityData({});
    formik.values.title = '';
    handleClose();
  };

  const onBackdropClick = () => {
    setIsDataSetted(false);
    setCityData({});
    formik.values.title = '';
  };

  return (
    <ModalWindow
      open={open}
      maxWidth="700px"
      onClose={handleClose}
      onBackdropClick={onBackdropClick}
    >
      <div className="addUsers">
        <form onSubmit={formik.handleSubmit}>
          <FormControl size="small" fullWidth>
            <TextField
              id="title"
              name="title"
              size="small"
              label="Название города *"
              value={formik.values.title}
              onChange={formik.handleChange}
              placeholder="Введите название города"
              error={formik.touched.title && Boolean(formik.errors.title)}
            />
            {(formik.touched.title && formik.errors.title) && (
              <FormHelperText error>{formik.errors.title}</FormHelperText>)}
            {errorMessage.length ? <span className="errorText">{errorMessage}</span> : null}
          </FormControl>
          <div className="addUsers-actions">
            <Button variant="contained" type="submit" disabled={isFetchingNewCities || isFetchingEditCities}>Сохранить</Button>
            <Button type="reset" onClick={() => onClickReset()}>Отмена</Button>
          </div>
        </form>
      </div>
    </ModalWindow>
  );
};

AddCities.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  selectedCity: PropTypes.object,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func
};

export default AddCities;
