import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button
} from '@mui/material';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import moment from 'moment';
import ModalWindow from '../ModalWindow/ModalWindow';
import { AuthorisationContext } from '../AuthorisationContext';
import { CashierContext } from '../CashierContext';

const ModalWindowCashier = ({ open, handleClose }) => {
  const { userRole } = useContext(AuthorisationContext);
  const { fetchEndSession } = useContext(CashierContext);
  const isCashier = userRole === 'Кассир';

  const onConfirmEndSession = useCallback(() => {
    fetchEndSession();
    handleClose();
  }, [fetchEndSession, handleClose]);

  return (
    <ModalWindow
      open={open}
      onClose={handleClose}
      maxWidth="500px"
    >
      <div className="addUsers">
        <CancelPresentationRoundedIcon className="close-btn" onClick={handleClose} />
        <div className="new-date">Хотите закрыть сессию?</div>
        <div className="set-time">
          <div className="set-time-text">{`Время закрытия: ${moment().format('D.MM.YYYY HH:MM')}`}</div>
        </div>
        <div className="addUsers-actions">
          <Button onClick={onConfirmEndSession} variant="contained" disabled={!isCashier}>Закрыть День</Button>
        </div>
      </div>
    </ModalWindow>
  );
};

ModalWindowCashier.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

export default ModalWindowCashier;
