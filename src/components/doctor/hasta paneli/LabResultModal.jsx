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
        <Typography variant="h6" gutterBottom>Laboratuvar Sonucu</Typography>
        <div className="space-y-4">
          <div>
            <Typography variant="subtitle2" color="textSecondary">Test Adı</Typography>
            <Typography>{result.testName || '-'}</Typography>
          </div>
          <div>
            <Typography variant="subtitle2" color="textSecondary">Tarih</Typography>
            <Typography>{result.date || '-'}</Typography>
          </div>
          <div>
            <Typography variant="subtitle2" color="textSecondary">Durum</Typography>
            <Typography>{result.status || '-'}</Typography>
          </div>
          <div>
            <Typography variant="subtitle2" color="textSecondary">Notlar</Typography>
            <Typography>{result.notes || '-'}</Typography>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

LabResultModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  result: PropTypes.shape({
    testName: PropTypes.string,
    date: PropTypes.string,
    status: PropTypes.string,
    notes: PropTypes.string
  }).isRequired
};

export default LabResultModal; 