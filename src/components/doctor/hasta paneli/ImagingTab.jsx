import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useSelector } from 'react-redux';
import { createImagingRequest } from '../../../services/doctor-service';
import { getImagingRequestByPatientId } from '../../../services/technicians-service';
import { message } from 'antd';

const ITEMS_PER_PAGE = 3;

const ImagingTab = () => {
  const isTablet = useMediaQuery({ maxWidth: 1070 });
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isSmallMobile = useMediaQuery({ maxWidth: 440 });
  const userDoctorId = useSelector((state) => state.auth.user?.id);
  const selectedPatient = useSelector((state) => state.treatment.patient);

  const [imagingRequests, setImagingRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    imagingType: '',
    bodyPart: '',
    notes: '',
    priority: 'NORMAL'
  });

  useEffect(() => {
    if (selectedPatient?.patientId) {
      fetchImagingRequests();
    }
  }, [selectedPatient]);

  const fetchImagingRequests = async () => {
    try {
      const response = await getImagingRequestByPatientId(selectedPatient.patientId);
      setImagingRequests(response);
    } catch (error) {
      console.error('Görüntüleme istekleri alınamadı:', error);
      message.error('Görüntüleme istekleri alınamadı');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (request) => {
    const date = request.status === 'COMPLETED' 
      ? new Date(request.completedAt)
      : new Date(request.createdAt);
    return `${date.toLocaleDateString('tr-TR')} ${date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
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

      await createImagingRequest(requestData);
      message.success('Görüntüleme talebi başarıyla oluşturuldu');
      
      await fetchImagingRequests();
      
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

  const filteredRequests = imagingRequests
    .sort((a, b) => {
      const dateA = a.status === 'COMPLETED' ? new Date(a.completedAt) : new Date(a.createdAt);
      const dateB = b.status === 'COMPLETED' ? new Date(b.completedAt) : new Date(b.createdAt);
      
      // Önce yıl karşılaştırması (yeniden eskiye)
      if (dateA.getFullYear() !== dateB.getFullYear()) {
        return dateB.getFullYear() - dateA.getFullYear();
      }
      
      // Yıllar aynıysa ay karşılaştırması (yeniden eskiye)
      if (dateA.getMonth() !== dateB.getMonth()) {
        return dateB.getMonth() - dateA.getMonth();
      }
      
      // Aylar aynıysa gün karşılaştırması (yeniden eskiye)
      if (dateA.getDate() !== dateB.getDate()) {
        return dateB.getDate() - dateA.getDate();
      }
      
      // Yıl, ay ve gün aynıysa saat karşılaştırması
      // Şimdiki zamana en yakın saatten en eskiye doğru sıralama
      const now = new Date();
      const timeA = dateA.getHours() * 60 + dateA.getMinutes();
      const timeB = dateB.getHours() * 60 + dateB.getMinutes();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const diffA = Math.abs(currentTime - timeA);
      const diffB = Math.abs(currentTime - timeB);
      
      return diffA - diffB;
    })
    .filter(request => {
      if (selectedStatus === 'ALL') return true;
      return request.status === selectedStatus;
    });

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // Filtre değiştiğinde ilk sayfaya dön
    setCurrentPage(1);
  }, [selectedStatus]);

  return (
    <div className={`${isTablet ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}>
      <div className="p-4 border rounded">
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} mb-4`}>
          <h3 className={`font-semibold ${isSmallMobile ? 'text-sm' : ''}`}>Geçmiş Görüntülemeler</h3>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`border rounded p-2 ${isSmallMobile ? 'text-sm w-full' : ''}`}
          >
            <option value="ALL">Tümü</option>
            <option value="PENDING">Bekleyenler</option>
            <option value="COMPLETED">Tamamlananlar</option>
          </select>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {paginatedRequests.map((request) => (
              <div 
                key={request.id}
                className={`border rounded p-3 ${isSmallMobile ? 'text-sm' : ''}`}
              >
                <div>
                  <div className={`${isSmallMobile ? 'flex flex-col gap-2' : 'flex items-center justify-between'} mb-2`}>
                    <div className={`flex ${isSmallMobile ? 'flex-col' : 'items-center'} gap-2`}>
                      <span className="font-medium">{request.imagingType} - {request.bodyPart}</span>
                      <span className={`${getStatusColor(request.status)} ${isSmallMobile ? 'text-xs' : 'text-sm'}`}>
                        ({getStatusText(request.status)})
                      </span>
                    </div>
                    <span className={`${isSmallMobile ? 'text-xs' : 'text-sm'} bg-gray-100 px-2 py-1 rounded text-gray-600`}>
                      {formatDate(request)}
                    </span>
                  </div>
                  {request.notes && (
                    <p className={`${isSmallMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-1`}>
                      <span className="font-medium">Not:</span> {request.notes}
                    </p>
                  )}
                  <p className={`${isSmallMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                    Öncelik: {request.priority === 'URGENT' ? 'Acil' : 'Normal'}
                  </p>
                  {request.findings && (
                    <p className={`${isSmallMobile ? 'text-xs' : 'text-sm'} text-gray-600 mt-1`}>Bulgular: {request.findings}</p>
                  )}
                </div>
                <div className="flex justify-end mt-2">
                  {request.imageUrl && (
                    <a 
                      href={request.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`bg-blue-500 text-white ${isSmallMobile ? 'px-3 py-1 text-xs' : 'px-4 py-1.5'} rounded hover:bg-blue-600 transition-colors duration-200`}
                    >
                      Görüntüle
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          {[...Array(3 - paginatedRequests.length)].map((_, index) => (
            <div key={`empty-${index}`} className="border rounded p-3 h-[120px] bg-gray-50">
              <div className="h-full flex items-center justify-center text-gray-400">
                
              </div>
            </div>
          ))}
          {filteredRequests.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              {selectedStatus === 'ALL' 
                ? 'Henüz görüntüleme talebi bulunmamaktadır.'
                : `${selectedStatus === 'PENDING' ? 'Bekleyen' : 'Tamamlanan'} görüntüleme talebi bulunmamaktadır.`
              }
            </div>
          )}
          
          {/* Sayfalandırma */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              {!isSmallMobile && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Önceki
                </button>
              )}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {!isSmallMobile && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Sonraki
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className={`font-semibold mb-4 ${isSmallMobile ? 'text-sm' : ''}`}>Yeni Görüntüleme Talebi</h3>
        <div className="space-y-3">
          <div>
            <label className={`block ${isSmallMobile ? 'text-xs' : 'text-sm'} mb-1`}>Görüntüleme Türü</label>
            <select 
              name="imagingType"
              value={formData.imagingType}
              onChange={handleInputChange}
              className={`w-full border rounded p-2 ${isSmallMobile ? 'text-sm' : ''}`}
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
            <label className={`block ${isSmallMobile ? 'text-xs' : 'text-sm'} mb-1`}>Çekim Bölgesi</label>
            <input 
              type="text" 
              name="bodyPart"
              value={formData.bodyPart}
              onChange={handleInputChange}
              className={`w-full border rounded p-2 ${isSmallMobile ? 'text-sm' : ''}`}
              placeholder="Çekim yapılacak bölge"
            />
          </div>
          <div>
            <label className={`block ${isSmallMobile ? 'text-xs' : 'text-sm'} mb-1`}>Talep Notları</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className={`w-full h-24 border rounded p-2 ${isSmallMobile ? 'text-sm' : ''}`}
              placeholder="Talep notları..."
            />
          </div>
          <div>
            <label className={`block ${isSmallMobile ? 'text-xs' : 'text-sm'} mb-1`}>Öncelik Durumu</label>
            <select 
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className={`w-full border rounded p-2 ${isSmallMobile ? 'text-sm' : ''}`}
            >
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Acil</option>
            </select>
          </div>
          <button 
            onClick={handleSubmit}
            className={`${
              isMobile ? 'w-full' : 'w-fit px-6'
            } ${isSmallMobile ? 'text-sm py-1.5' : 'py-2'} bg-blue-500 text-white rounded hover:bg-blue-600 ${
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