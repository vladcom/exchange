import React, { useCallback, useContext, useState, useEffect } from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import {
  Button
} from '@mui/material';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import isEmpty from 'lodash.isempty';
import useFetch from '../../../hooks/useFetch';
import { CashierContext } from '../CashierContext';
import ModalWindow from '../ModalWindow/ModalWindow';
import { AuthorisationContext } from '../AuthorisationContext';
import AlertSnackbar from '../../common/Snackbar/AlertSnackbar';
import OperationsService from '../../../services/OPERATIONS/OperationsService';

const ModalWindowCashier = ({ open, handleClose, data, reset }) => {
  const { userRole } = useContext(AuthorisationContext);
  const { cashierCurrency } = useContext(CashierContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const isCashier = userRole === 'Кассир';
  const Cur = (CurId) => (!isEmpty(cashierCurrency) && !isEmpty(data)
    ? cashierCurrency.find((item) => item.id === CurId).title
    : null);

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
      handleClose();
      reset();
    }
  }, [handleClose, reset]);

  const { fetch: fetchSellBuyOperation } = useFetch({
    requestFunction: OperationsService.postRequest,
    setResponse: onGetResponse
  });

  const onConfirmTransaction = useCallback(() => {
    fetchSellBuyOperation(data);
  }, [fetchSellBuyOperation, data]);

  return (
    <ModalWindow
      open={open}
      onClose={handleClose}
      maxWidth="500px"
    >
      <div className="addUsers">
        <CancelPresentationRoundedIcon className="close-btn" onClick={handleClose} />
        <div className="new-date">Подтвердите операцию</div>
        <div className="modal-window-data">
          <div className="set-time-text">{`Приход: ${data.arrival_value} ${Cur(data.arrival_currency_id)}`}</div>
          <div className="set-time-text">{`По курсу: ${data.rate}`}</div>
          <div className="set-time-text">{`Расход: ${data.expense_value} ${Cur(data.expense_currency_id)}`}</div>
          <div className="set-time-text">{`Комментарий: ${data.comment}`}</div>
          {errorMessage.length ? <p className="errorText">{errorMessage}</p> : null}
        </div>
        <div className="addUsers-actions">
          <AlertSnackbar isOpen={isOpenSnackbar} success message="Операция проведена успешно" />
          <Button onClick={onConfirmTransaction} variant="contained" disabled={!isCashier}>Подтвердить</Button>
        </div>
      </div>
    </ModalWindow>
  );
};

ModalWindowCashier.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  data: PropTypes.object,
  reset: PropTypes.func
};

export default ModalWindowCashier;
