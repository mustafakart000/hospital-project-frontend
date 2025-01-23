import React, { useState } from 'react';
import { createVitals } from '../../../services/vitals-service';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';

const VitalsTab = ({ doctorId, patientId, onSaveAndExit }) => {
  const isMobile = useMediaQuery({ maxWidth: 700 });
  const isExtraSmall = useMediaQuery({ maxWidth: 400 });
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    pulse: '',
    temperature: '',
    respiration: '',
    spO2: '',
    height: '',
    weight: '',
    bmi: ''
  });

  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightInMeters = height / 100; // cm'den metreye çevirme
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setVitals(prev => ({ ...prev, bmi }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));

    if (name === 'height' || name === 'weight') {
      calculateBMI(
        name === 'height' ? value : vitals.height,
        name === 'weight' ? value : vitals.weight
      );
    }
  };

  const handleSubmit = async () => {
    try {
      const vitalData = {
        doctorId,
        patientId,
        ...vitals,
        height: parseFloat(vitals.height) / 100, // cm'yi metreye çevirme
        pulse: parseInt(vitals.pulse),
        temperature: parseFloat(vitals.temperature),
        respiration: parseInt(vitals.respiration),
        spO2: parseInt(vitals.spO2),
        weight: parseFloat(vitals.weight),
        bmi: parseFloat(vitals.bmi)
      };

      await createVitals(vitalData);
      toast.success('Vital bulgular başarıyla kaydedildi');
      if (onSaveAndExit) {
        onSaveAndExit();
      }
    } catch (error) {
      toast.error('Vital bulgular kaydedilirken bir hata oluştu');
      console.error('Vital kayıt hatası:', error);
    }
  };

  return (
    <div className={`${isMobile ? 'grid grid-cols-1' : 'grid grid-cols-2'} gap-4`} data-tab="vitals" ref={(el) => {
      if (el) {
        el.handleSubmit = handleSubmit;
      }
    }}>
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Vital Bulgular</h3>
        <div className="space-y-2">
          <div className={`${isExtraSmall ? 'flex flex-col space-y-1' : 'flex justify-between'}`}>
            <span>Tansiyon:</span>
            <input
              type="text"
              name="bloodPressure"
              value={vitals.bloodPressure}
              onChange={handleInputChange}
              className={`border rounded px-2 ${isExtraSmall ? 'w-full' : ''}`}
              placeholder="120/80"
            />
          </div>
          <div className={`${isExtraSmall ? 'flex flex-col space-y-1' : 'flex justify-between'}`}>
            <span>Nabız:</span>
            <input
              type="number"
              name="pulse"
              value={vitals.pulse}
              onChange={handleInputChange}
              className={`border rounded px-2 ${isExtraSmall ? 'w-full' : ''}`}
              placeholder="72"
            />
          </div>
          <div className={`${isExtraSmall ? 'flex flex-col space-y-1' : 'flex justify-between'}`}>
            <span>Ateş:</span>
            <input
              type="number"
              name="temperature"
              value={vitals.temperature}
              onChange={handleInputChange}
              className={`border rounded px-2 ${isExtraSmall ? 'w-full' : ''}`}
              placeholder="36.5"
              step="0.1"
            />
          </div>
          <div className={`${isExtraSmall ? 'flex flex-col space-y-1' : 'flex justify-between'}`}>
            <span>Solunum:</span>
            <input
              type="number"
              name="respiration"
              value={vitals.respiration}
              onChange={handleInputChange}
              className={`border rounded px-2 ${isExtraSmall ? 'w-full' : ''}`}
              placeholder="16"
            />
          </div>
          <div className={`${isExtraSmall ? 'flex flex-col space-y-1' : 'flex justify-between'}`}>
            <span>SpO2:</span>
            <input
              type="number"
              name="spO2"
              value={vitals.spO2}
              onChange={handleInputChange}
              className={`border rounded px-2 ${isExtraSmall ? 'w-full' : ''}`}
              placeholder="98"
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Ölçümler</h3>
        <div className="space-y-2">
          <div className={`${isExtraSmall ? 'flex flex-col space-y-1' : 'flex justify-between'}`}>
            <span>Boy (cm):</span>
            <input
              type="number"
              name="height"
              value={vitals.height}
              onChange={handleInputChange}
              className={`border rounded px-2 ${isExtraSmall ? 'w-full' : ''}`}
            />
          </div>
          <div className={`${isExtraSmall ? 'flex flex-col space-y-1' : 'flex justify-between'}`}>
            <span>Kilo (kg):</span>
            <input
              type="number"
              name="weight"
              value={vitals.weight}
              onChange={handleInputChange}
              className={`border rounded px-2 ${isExtraSmall ? 'w-full' : ''}`}
            />
          </div>
          <div className={`${isExtraSmall ? 'flex flex-col space-y-1' : 'flex justify-between'}`}>
            <span>VKİ:</span>
            <input
              type="number"
              name="bmi"
              value={vitals.bmi}
              className={`border rounded px-2 ${isExtraSmall ? 'w-full' : ''}`}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

VitalsTab.propTypes = {
  doctorId: PropTypes.number.isRequired,
  patientId: PropTypes.number.isRequired,
  onSaveAndExit: PropTypes.func
};

export default VitalsTab;