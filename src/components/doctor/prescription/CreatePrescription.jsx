import React, { useState } from 'react';
import { createPrescription } from '../../../services/prescription-service';
import MedicationsTab from '../hasta paneli/MedicationsTab';
import { Button, notification } from 'antd';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';

const CreatePrescription = ({ doctorId, patientId, reservationId }) => {
  const isMobile = useMediaQuery({ maxWidth: 710 });

  const [prescriptionData, setPrescriptionData] = useState({
    doctorId,
    patientId,
    reservationId,
    medications: [],
    notes: ''
  });

  const [shouldResetForm, setShouldResetForm] = useState(false);

  const handlePrescriptionChange = (newData) => {
    setPrescriptionData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleSubmit = async () => {
    try {
      await createPrescription(prescriptionData);
      notification.success({
        message: 'Başarılı',
        description: 'Reçete başarıyla oluşturuldu.',
      });
      setShouldResetForm(true);
      setTimeout(() => setShouldResetForm(false), 100);
    } catch (error) {
      notification.error({
        message: error.message,
        description: 'Reçete oluşturulurken bir hata oluştu.',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>Yeni Reçete Oluştur</h2>
      </div>

      <MedicationsTab 
        onPrescriptionChange={handlePrescriptionChange} 
        resetForm={shouldResetForm}
      />

      <div className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
        <Button 
          type="primary"
          onClick={handleSubmit}
          style={{
            width: isMobile ? '100%' : 'auto',
            height: isMobile ? '48px' : '40px',
            fontSize: isMobile ? '14px' : '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3b82f6'
          }}
        >
          Reçeteyi Oluştur
        </Button>
      </div>
    </div>
  );
};

CreatePrescription.propTypes = {
  doctorId: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
  reservationId: PropTypes.string.isRequired
};

export default CreatePrescription; 