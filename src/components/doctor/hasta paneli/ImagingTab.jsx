import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useSelector } from 'react-redux';
import { createImagingRequest } from '../../../services/doctor-service';
import { message } from 'antd';

const ImagingTab = () => {
  const isTablet = useMediaQuery({ maxWidth: 1070 });
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const userDoctorId = useSelector((state) => state.auth.user?.id);
  const selectedPatient = useSelector((state) => state.treatment.patient);

  const [imagingRequests, setImagingRequests] = useState([]);

  const [formData, setFormData] = useState({
    imagingType: '',
    bodyPart: '',
    notes: '',
    priority: 'NORMAL'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Bekliyor',
      'COMPLETED': 'Tamamlandı',
      'CANCELLED': 'İptal Edildi'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'text-yellow-500',
      'COMPLETED': 'text-green-500',
      'CANCELLED': 'text-red-500'
    };
    return colorMap[status] || 'text-gray-500';
  };

  const handleSubmit = async () => {
    try {
      if (!formData.imagingType || !formData.bodyPart) {
        message.error('Lütfen gerekli alanları doldurun');
        return;
      }

      const requestData = {
        patientId: String(selectedPatient?.patientId),
        doctorId: String(userDoctorId),
        imagingType: formData.imagingType,
        bodyPart: formData.bodyPart,
        notes: formData.notes,
        priority: formData.priority
      };

      const response = await createImagingRequest(requestData);
      message.success('Görüntüleme talebi başarıyla oluşturuldu');
      
      // Yeni talebi listeye ekle
      setImagingRequests(prev => [response, ...prev]);
      
      // Form verilerini sıfırla
      setFormData({
        imagingType: '',
        bodyPart: '',
        notes: '',
        priority: 'NORMAL'
      });
    } catch (error) {
      console.error('Görüntüleme talebi oluşturulurken hata:', error);
      message.error('Görüntüleme talebi oluşturulurken bir hata oluştu');
    }
  };

  return (
    <div className={`${isTablet ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}>
      <div className="p-4 border rounded">
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} mb-4`}>
          <h3 className="font-semibold">Geçmiş Görüntülemeler</h3>
        </div>
        <div className="space-y-3">
          {imagingRequests.map((request) => (
            <div 
              key={request.id}
              className={`border rounded p-3 ${isMobile ? 'space-y-2' : 'flex justify-between items-center'}`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{request.imagingType} - {request.bodyPart}</span>
                  <span className={`text-sm ${getStatusColor(request.status)}`}>
                    ({getStatusText(request.status)})
                  </span>
                </div>
                <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
                {request.notes && (
                  <p className="text-sm text-gray-600 mt-1">{request.notes}</p>
                )}
                <p className="text-sm text-gray-500">
                  Öncelik: {request.priority === 'URGENT' ? 'Acil' : 'Normal'}
                </p>
              </div>
              <div className={`flex gap-2 ${isMobile ? 'justify-end' : ''}`}>
                <button className="text-blue-500 hover:text-blue-600">Görüntüle</button>
                {request.status === 'PENDING' && (
                  <button className="text-green-500 hover:text-green-600">Sonuç Gir</button>
                )}
              </div>
            </div>
          ))}
          {imagingRequests.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Henüz görüntüleme talebi bulunmamaktadır.
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-4">Yeni Görüntüleme Talebi</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Görüntüleme Türü</label>
            <select 
              name="imagingType"
              value={formData.imagingType}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            >
              <option value="">Görüntüleme Türü Seçin</option>
              <option value="EKG">EKG</option>
              <option value="XRAY">Röntgen</option>
              <option value="MRI">MR</option>
              <option value="CT">Tomografi</option>
              <option value="USG">Ultrason</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Çekim Bölgesi</label>
            <input 
              type="text" 
              name="bodyPart"
              value={formData.bodyPart}
              onChange={handleInputChange}
              className="w-full border rounded p-2" 
              placeholder="Çekim yapılacak bölge"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Talep Notları</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full h-24 border rounded p-2" 
              placeholder="Talep notları..."
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Öncelik Durumu</label>
            <select 
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            >
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Acil</option>
            </select>
          </div>
          <button 
            onClick={handleSubmit}
            className={`${
              isMobile ? 'w-full' : 'w-fit px-6'
            } bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
              !isMobile && 'float-right'
            }`}
          >
            Görüntüleme Talebi Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagingTab;