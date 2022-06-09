import React, { useCallback, useContext, useState } from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import { useFormik } from 'formik';
import moment from 'moment';
import { nanoid } from 'nanoid';
import ModalWindow from '../ModalWindow/ModalWindow';
import validationSchemaNewUser from './validateForm';
import { AuthorisationContext } from '../AuthorisationContext';
import { CashierContext } from '../CashierContext';
import { minutes as minutesList, hours as hoursList } from '../../../constants/time';

const ModalWindowCashier = ({ open, handleClose }) => {
  const { userRole, user, cashierData } = useContext(AuthorisationContext);
  const { fetchStartSession } = useContext(CashierContext);
  const [errorMessage, setErrorMessage] = useState({});
  const isCashier = userRole === 'Кассир';
  const approxSessionLength = cashierData.approx_session_length.split(':');

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.2 + ITEM_PADDING_TOP,
        width: 120
      }
    }
  };

  const onSubmitForm = useCallback((value) => {
    const {
      hours,
      minutes
    } = value;
    const time = [hours, minutes];
    const formattedTime = time.join(':');

    fetchStartSession({
      user_id: user.id,
      department_id: cashierData.id,
      session_length: formattedTime
    });
    handleClose();
  }, [user, fetchStartSession, handleClose, cashierData]);

  const formik = useFormik({
    initialValues: {
      hours: approxSessionLength[0],
      minutes: approxSessionLength[1]
    },
    validationSchema: validationSchemaNewUser,
    onSubmit: (values, { resetForm }) => {
      onSubmitForm(values);
      resetForm();
    }
  });

  const renderErrors = useCallback(() => {
    if (!isEmpty(errorMessage)) {
      return errorMessage.map((item) => <p key={nanoid()} className="errorText">{item}</p>);
    }
  }, [errorMessage]);

  const onClickReset = () => {
    formik.resetForm();
    handleClose();
    setErrorMessage({});
  };

  return (
    <ModalWindow
      open={open}
      onClose={handleClose}
      maxWidth="500px"
    >
      <div className="addUsers">
        <form
          onSubmit={formik.handleSubmit}
        >
          <CancelPresentationRoundedIcon className="close-btn" onClick={onClickReset} />
          <div className="new-date">{moment().format('D.MM.YYYY')}</div>
          <div className="set-time">
            <div className="set-time-text">Длительность:</div>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel>Часов</InputLabel>
              <Select
                className="set-time-input"
                required
                autoWidth
                id="hours"
                size="small"
                name="hours"
                label="Часов"
                placeholder="Часов"
                MenuProps={MenuProps}
                disabled={!isCashier}
                value={formik.values.hours}
                onChange={formik.handleChange}
                defaultValue={Number(approxSessionLength[0])}
                error={formik.touched.hours && Boolean(formik.errors.hours)}
              >
                {hoursList.map((hour) => (
                  <MenuItem key={hour} value={hour} disabled={formik.values.minutes === '00' && hour === '00'}>{hour}</MenuItem>
                ))}
              </Select>
              {(formik.touched.hours && formik.errors.hours) && (
              <FormHelperText error>{formik.errors.hours}</FormHelperText>)}
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel>Минут</InputLabel>
              <Select
                className="set-time-input"
                required
                autoWidth
                id="minutes"
                size="small"
                name="minutes"
                label="Минут"
                disabled={!isCashier}
                placeholder="Минут"
                defaultValue={Number(approxSessionLength[1])}
                value={formik.values.minutes}
                onChange={formik.handleChange}
                MenuProps={MenuProps}
                error={formik.touched.minutes && Boolean(formik.errors.minutes)}
              >
                {minutesList.map((minute) => (
                  <MenuItem key={minute} value={minute} disabled={formik.values.hours === '00' && minute === '00'}>{minute}</MenuItem>
                ))}
              </Select>
              {(formik.touched.minutes && formik.errors.minutes) && (
              <FormHelperText error>{formik.errors.minutes}</FormHelperText>)}
            </FormControl>
            {renderErrors()}
          </div>
          <div className="addUsers-actions">
            <Button variant="contained" type="submit">Открыть День</Button>
          </div>
        </form>
      </div>
    </ModalWindow>
  );
};

ModalWindowCashier.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

export default ModalWindowCashier;
