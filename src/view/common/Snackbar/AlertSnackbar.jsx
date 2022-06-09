import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Snackbar } from '@mui/material';

const AlertSnackbar = ({ isOpen, onClose, message, success, notification }) => (
  <Snackbar
    open={isOpen}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    autoHideDuration={3000}
  >
    <Alert severity={success ? 'success' : 'error'} variant="filled" className={notification ? 'whiteNotification' : ''} onClose={onClose}>
      {message}
    </Alert>
  </Snackbar>
);

AlertSnackbar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  success: PropTypes.bool,
  message: PropTypes.string,
  notification: PropTypes.bool
};

export default AlertSnackbar;
