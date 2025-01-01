    import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
const LabResultModal = ({ open, onClose, result }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography variant="h6">Laboratuvar Sonucu</Typography>
        <Typography>{result}</Typography>
      </Box>
    </Modal>
  );
};

LabResultModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  result: PropTypes.string.isRequired
};

export default LabResultModal; 