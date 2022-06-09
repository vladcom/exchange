import React from 'react';
import { Backdrop, Box, Modal } from '@mui/material';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '700px',
  width: '100%',
  borderRadius: '20px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const ModalWindow = ({ open, children, onClose, onBackdropClick, maxWidth }) => (
  <Modal
    open={open}
    className="modal"
    onClose={onClose}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{ timeout: 300 }}
    onBackdropClick={onBackdropClick}
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
  >
    <Box sx={{ ...style, maxWidth }}>
      {children}
    </Box>
  </Modal>
);

ModalWindow.propTypes = {
  open: PropTypes.bool.isRequired,
  onBackdropClick: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  maxWidth: PropTypes.string
};

export default ModalWindow;
