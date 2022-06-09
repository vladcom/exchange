import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Button, FormControl, FormHelperText, TextField } from '@mui/material';
import * as yup from 'yup';
import isEmpty from 'lodash.isempty';
import useFetch from '../../../hooks/useFetch';
import FilialService from '../../../services/FILIAL/FilialService';
import ModalWindow from '../ModalWindow/ModalWindow';
import { DashboardContext } from '../DashboardContext';
import useIsMounted from '../../../hooks/useIsMounted';

const AddFilials = ({
  open,
  handleClose,
  errorMessage,
  selectedFilial,
  setErrorMessage
}) => {
  const isMounted = useIsMounted();
  const { fetchFilials } = useContext(DashboardContext);
  const [filialData, setFilialData] = useState({});
  const [isDataSetted, setIsDataSetted] = useState(false);

  useEffect(() => {
    if (isEmpty(filialData) && !isEmpty(selectedFilial)) {
      setFilialData(selectedFilial);
    }
  }, [selectedFilial, filialData]);

  const onGetResponse = useCallback((response) => {
    if (!response.message) {
      setErrorMessage('');
      handleClose();
      fetchFilials();

      if (!isEmpty(selectedFilial)) {
        setIsDataSetted(true);
      }
    }
    if (response.message) {
      setErrorMessage('Филиал уже существует');
    }
  }, [handleClose, selectedFilial, fetchFilials, setErrorMessage]);

  const { fetch: fetchAddFilials, loading: isFetchingNewFilials } = useFetch({
    requestFunction: FilialService.postRequest,
    setResponse: onGetResponse,
    withLoading: true
  });

  const { fetch: fetchEditFilials, loading: isFetchingEditFilials } = useFetch({
    requestFunction: FilialService.putRequest,
    setResponse: onGetResponse,
    withLoading: true
  });

  const submitForm = useCallback((value) => {
    const { title } = value;
    if (!isEmpty(value)) {
      if (isEmpty(selectedFilial)) {
        fetchAddFilials({
          title
        });
      }
      if (!isEmpty(selectedFilial)) {
        fetchEditFilials({ id: filialData.id, title });
      }
    }
  }, [fetchAddFilials, filialData, fetchEditFilials, selectedFilial]);

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
      if (!isEmpty(filialData) && !isDataSetted) {
        setIsDataSetted(true);

        if (isEmpty(formik.values.title)) {
          formik.values.title = filialData.title;
        }
      }
    }
  }, [filialData, formik, isMounted, setIsDataSetted, isDataSetted]);

  const onClickReset = () => {
    formik.resetForm();
    setIsDataSetted(false);
    setFilialData({});
    formik.values.title = '';
    handleClose();
  };

  const onBackdropClick = () => {
    setIsDataSetted(false);
    setFilialData({});
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
              size="small"
              id="title"
              label="Название филиала *"
              name="title"
              placeholder="Введите название филиала"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
            />
            {(formik.touched.title && formik.errors.title) && (
              <FormHelperText error>{formik.errors.title}</FormHelperText>)}
            {errorMessage.length ? <span className="errorText">{errorMessage}</span> : null}
          </FormControl>
          <div className="addUsers-actions">
            <Button variant="contained" type="submit" disabled={isFetchingNewFilials || isFetchingEditFilials}>Сохранить</Button>
            <Button type="reset" onClick={() => onClickReset()}>Отмена</Button>
          </div>
        </form>
      </div>
    </ModalWindow>
  );
};

AddFilials.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func,
  selectedFilial: PropTypes.object
};

export default AddFilials;
