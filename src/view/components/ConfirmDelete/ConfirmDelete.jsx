import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import ModalWindow from '../ModalWindow/ModalWindow';
import './style.scss';

const ConfirmDelete = ({
  open,
  label,
  onClose,
  onClickButton
}) => (
  <ModalWindow
    open={open}
    maxWidth="700px"
    onClose={onClose}
    onBackdropClick={onClose}
  >
    <div className="confirmDelete">
      <p className="confirmDelete-title">Подтверждение</p>
      <p className="confirmDelete-subTitle">{label}</p>
      <div className="confirmDelete-actions" onClick={onClose}>
        <Button variant="outlined">
          Отменить
        </Button>
        <Button variant="contained" onClick={onClickButton}>
          Удалить
        </Button>
      </div>
    </div>
  </ModalWindow>
);

ConfirmDelete.propTypes = {
  open: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickButton: PropTypes.func.isRequired
};

export default ConfirmDelete;
