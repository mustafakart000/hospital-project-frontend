import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getAllMedicinesByDoctorSpeciality } from '../../../services/medicine-service';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { Trash2 } from 'lucide-react';

const MedicationsTab = ({ onPrescriptionChange }) => {
  const userDoctorId = useSelector((state) => state.auth.user?.id);
  const selectedPatient = useSelector((state) => state.treatment.patient);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  
  const initialPrescriptionData = useMemo(() => ({
    doctorId: userDoctorId ? String(userDoctorId) : null,
    patientId: selectedPatient?.patientId ? String(selectedPatient.patientId) : null,
    reservationId: selectedPatient?.reservationId ? String(selectedPatient.reservationId) : null,
    medications: [],
    notes: ''
  }), [userDoctorId, selectedPatient]);

  const [prescriptionData, setPrescriptionData] = useState(initialPrescriptionData);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        console.log("İlaçlar yükleniyor...");
        const response = await getAllMedicinesByDoctorSpeciality();
        console.log("API yanıtı:", response);

        if (!response || !Array.isArray(response)) {
          console.error("API yanıtı geçersiz:", response);
          return;
        }

        const sortedMedicines = response.sort((a, b) => {
          const categoryCompare = a.category.localeCompare(b.category, 'tr', { sensitivity: 'base' });
          return categoryCompare === 0 
            ? a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' })
            : categoryCompare;
        });
        
        console.log("Sıralanmış ilaçlar:", sortedMedicines);
        setMedicines(sortedMedicines);
      } catch (error) {
        console.error("İlaçlar yüklenirken hata oluştu:", error);
        setMedicines([]);
      }
    };

    loadMedicines();
  }, []);

  useEffect(() => {
    setPrescriptionData(initialPrescriptionData);
  }, [initialPrescriptionData]);

  const handleMedicineChange = (e) => {
    const selectedId = e.target.value;
    console.log("Seçilen ilaç ID:", selectedId);
    
    if (!selectedId) {
      setSelectedMedicine(null);
      return;
    }

    const medicine = medicines.find(m => m.id === parseInt(selectedId));
    console.log("Bulunan ilaç:", medicine);

    if (medicine) {
      setSelectedMedicine(medicine);
      
      // API formatına uygun şekilde ilaç ekle
      const startDate = new Date().toISOString();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 5); // Varsayılan 5 günlük süre

      // Mevcut ilaçları kontrol et
      const existingMedication = prescriptionData.medications.find(m => m.medicineId === String(medicine.id));

      const updatedPrescription = {
        ...prescriptionData,
        medications: [
          ...prescriptionData.medications.filter(m => m.medicineId !== String(medicine.id)),
          {
            medicineId: String(medicine.id),
            name: medicine.name,
            dosage: `${medicine.dosage}mg`,
            usage: existingMedication?.usage || "",
            frequency: existingMedication?.frequency || "",
            duration: existingMedication?.duration || 5,
            startDate: existingMedication?.startDate || startDate,
            endDate: existingMedication?.endDate || endDate.toISOString()
          }
        ]
      };
      
      setPrescriptionData(updatedPrescription);
      onPrescriptionChange?.(updatedPrescription);
    }
  };

  const handleDurationChange = (medicineId, duration) => {
    if (!medicineId) return;

    const updatedMedications = prescriptionData.medications.map(med => {
      if (med.medicineId === medicineId) {
        const startDate = new Date(med.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + parseInt(duration));

        return {
          ...med,
          duration: parseInt(duration),
          endDate: endDate.toISOString()
        };
      }
      return med;
    });

    const updatedPrescription = {
      ...prescriptionData,
      medications: updatedMedications
    };

    setPrescriptionData(updatedPrescription);
    onPrescriptionChange?.(updatedPrescription);
  };

  const handleNotesChange = (e) => {
    const updatedPrescription = {
      ...prescriptionData,
      notes: e.target.value
    };
    setPrescriptionData(updatedPrescription);
    onPrescriptionChange?.(updatedPrescription);
  };

  const handleUsageChange = (e) => {
    const usage = e.target.value;
    if (selectedMedicine) {
      const updatedMedications = prescriptionData.medications.map(med => 
        med.medicineId === String(selectedMedicine.id)
          ? { ...med, usage } 
          : med
      );
      
      const updatedPrescription = {
        ...prescriptionData,
        medications: updatedMedications
      };
      
      setPrescriptionData(updatedPrescription);
      onPrescriptionChange?.(updatedPrescription);
    }
  };

  const handleFrequencyChange = (e) => {
    const frequency = e.target.value;
    if (selectedMedicine) {
      const updatedMedications = prescriptionData.medications.map(med => 
        med.medicineId === String(selectedMedicine.id)
          ? { ...med, frequency } 
          : med
      );
      
      const updatedPrescription = {
        ...prescriptionData,
        medications: updatedMedications
      };
      
      setPrescriptionData(updatedPrescription);
      onPrescriptionChange?.(updatedPrescription);
    }
  };

  const handleRemoveMedicine = (medicineId) => {
    const updatedMedications = prescriptionData.medications.filter(
      med => med.medicineId !== medicineId
    );
    
    const updatedPrescription = {
      ...prescriptionData,
      medications: updatedMedications
    };
    
    setPrescriptionData(updatedPrescription);
    onPrescriptionChange?.(updatedPrescription);
    
    if (selectedMedicine?.id === medicineId) {
      setSelectedMedicine(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="p-4 border rounded">
        <div className="flex flex-col space-y-3 mb-4">
          <h3 className="font-semibold">İlaç Listesi</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-3">
            <div>
              <label className="block text-sm mb-1">İlaç Adı</label>
              <select 
                className="w-full border rounded p-2"
                onChange={handleMedicineChange}
                value={selectedMedicine?.id || ""}
              >
                <option value="">Seçiniz</option>
                {medicines.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name} - {medicine.category} ({medicine.dosage} mg)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Doz</label>
              <input 
                type="text" 
                className="w-full border rounded p-2" 
                value={selectedMedicine ? `${selectedMedicine.dosage} mg` : ''}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Kullanım Şekli</label>
              <select 
                className="w-full border rounded p-2"
                onChange={handleUsageChange}
                value={selectedMedicine ? (prescriptionData.medications.find(m => m.medicineId === String(selectedMedicine.id))?.usage || "") : ""}
              >
                <option value="">Seçiniz</option>
                <option value="oral">Oral</option>
                <option value="im">IM</option>
                <option value="iv">IV</option>
                <option value="sc">SC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Sıklık</label>
              <select 
                className="w-full border rounded p-2"
                onChange={handleFrequencyChange}
                value={selectedMedicine ? (prescriptionData.medications.find(m => m.medicineId === String(selectedMedicine.id))?.frequency || "") : ""}
              >
                <option value="">Seçiniz</option>
                <option value="1x1">Günde 1x1</option>
                <option value="2x1">Günde 2x1</option>
                <option value="3x1">Günde 3x1</option>
                <option value="4x1">Günde 4x1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Süre (Gün)</label>
              <input 
                type="number" 
                min="1"
                className="w-full border rounded p-2"
                value={selectedMedicine ? prescriptionData.medications.find(m => m.medicineId === String(selectedMedicine.id))?.duration || 5 : 5}
                onChange={(e) => selectedMedicine && handleDurationChange(String(selectedMedicine.id), e.target.value)}
              />
            </div>
          </div>
          {prescriptionData.medications.length > 0 && (
            <div className="border rounded p-3">
              <h4 className="font-semibold mb-3">Seçilen İlaçlar</h4>
              <div className="space-y-2">
                {prescriptionData.medications.map((medicine) => (
                  <div 
                    key={medicine.medicineId}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{medicine.name}</div>
                      <div className="text-sm text-gray-600">
                        {medicine.dosage} - {medicine.usage || 'Kullanım şekli seçilmedi'} - 
                        {medicine.frequency || 'Sıklık seçilmedi'} - {medicine.duration} gün
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(medicine.startDate).toLocaleDateString('tr-TR')} - 
                        {new Date(medicine.endDate).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleRemoveMedicine(medicine.medicineId)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="border rounded p-3">
            <div className="grid grid-cols-1">
              <div>
                <label className="block text-sm mb-1">Reçete Notları</label>
                <textarea 
                  className="w-full h-24 border rounded p-2" 
                  placeholder="İlaç kullanımı ile ilgili özel notlar..."
                  value={prescriptionData.notes}
                  onChange={handleNotesChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
       
      </div>
    </div>
  );
};

MedicationsTab.propTypes = {
  onPrescriptionChange: PropTypes.func
};

export default MedicationsTab;