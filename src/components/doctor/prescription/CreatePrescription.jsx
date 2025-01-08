import React, { useState } from 'react';
import { createPrescription } from '../../../services/prescription-service';
import MedicationsTab from '../hasta paneli/MedicationsTab';
import { Button, notification } from 'antd';
import PropTypes from 'prop-types';
const CreatePrescription = ({ doctorId, patientId, reservationId }) => {
  const [prescriptionData, setPrescriptionData] = useState({
    doctorId,
    patientId,
    reservationId,
    medications: [],
    notes: ''
  });

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
        <h2 className="text-xl font-semibold">Yeni Reçete Oluştur</h2>
      </div>

      <MedicationsTab onPrescriptionChange={handlePrescriptionChange} />

      <div className="flex justify-end">
        <Button 
          type="primary"
          onClick={handleSubmit}
          className="bg-blue-500"
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