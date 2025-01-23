import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useSelector } from 'react-redux';
import { createImagingRequest } from '../../../services/doctor-service';
import { getImagingRequestByPatientId, getImagingRequestImageById } from '../../../services/technicians-service';
import { message, Modal } from 'antd';
import ReactPaginate from 'react-paginate';

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
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    try {
      if (!request) return '-';
      
      const date = request.status === 'COMPLETED' && request.completedAt
        ? new Date(request.completedAt)
        : new Date(request.createdAt);

      if (isNaN(date.getTime())) {
        return request.status === 'COMPLETED' ? request.completedAt : request.createdAt;
      }

      return date.toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Tarih formatı hatası:', error);
      return '-';
    }
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

  const handleImageView = async (imageId) => {
    try {
      setLoading(true);
      const response = await getImagingRequestImageById(selectedPatient.patientId, imageId);
      
      if (!response || !response.imageData) {
        message.error('Görüntü verisi bulunamadı. Lütfen teknisyenin görüntüyü yüklemesini bekleyin.');
        return;
      }

      // Base64 görüntüyü direkt olarak yeni sekmede aç
      const newWindow = window.open();
      newWindow.document.write(
        `<img src="data:image/png;base64,${response.imageData}" style="max-width: 100%; height: auto;" />`
      );

    } catch (error) {
      console.error('Görüntü görüntüleme hatası:', error);
      
      if (error.response?.status === 403) {
        message.error('Bu görüntüye erişim yetkiniz bulunmamaktadır. Lütfen tekrar giriş yapın.');
      } else if (error.response?.status === 404) {
        message.error('Görüntü henüz yüklenmemiş. Lütfen teknisyenin görüntüyü yüklemesini ve işlemi tamamlamasını bekleyin.');
      } else if (error.code === 'ERR_NETWORK') {
        message.error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
      } else if (error.message.includes('Görüntü verisi bulunamadı')) {
        message.error('Görüntü verisi henüz hazır değil. Lütfen teknisyenin işlemi tamamlamasını bekleyin.');
      } else {
        message.error('Görüntü görüntülenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalVisible(true);
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
  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    // Filtre değiştiğinde ilk sayfaya dön
    setCurrentPage(1);
  }, [selectedStatus]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

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
          <div className="grid grid-cols-1 gap-3 min-h-[340px]">
            {paginatedData.map((request) => (
              <div 
                key={request.id}
                className={`border rounded p-3 ${isSmallMobile ? 'text-sm' : ''} h-[${isSmallMobile ? '130px' : '100px'}] bg-white flex flex-col justify-between`}
              >
                <div>
                  <div className={`${isSmallMobile ? 'flex flex-col gap-1' : 'flex items-center justify-between'} mb-2`}>
                    <div className={`${isSmallMobile ? 'flex flex-col' : 'flex items-center'} gap-2`}>
                      <span className="font-medium">{request.imagingType} - {request.bodyPart}</span>
                      <span className={`${getStatusColor(request.status)} ${isSmallMobile ? 'text-xs' : 'text-sm'}`}>
                        ({getStatusText(request.status)})
                      </span>
                    </div>
                    <span className={`${isSmallMobile ? 'text-xs mt-1' : 'text-sm'} bg-gray-100 px-2 py-1 rounded text-gray-600`}>
                      {formatDate(request)}
                    </span>
                  </div>
                </div>
                <div className={`flex ${isSmallMobile ? 'flex-col' : 'justify-end'} gap-2`}>
                  <button
                    onClick={() => handleViewDetails(request)}
                    className={`text-blue-500 hover:text-blue-600 ${isSmallMobile ? 'text-xs w-full py-1' : 'text-sm'} font-medium ${isSmallMobile ? 'border border-blue-500 rounded' : ''}`}
                  >
                    Detayları Görüntüle
                  </button>
                  {request.status === 'COMPLETED' && (
                    <button 
                      onClick={() => handleImageView(request.id)}
                      disabled={loading}
                      className={`bg-blue-500 text-white ${isSmallMobile ? 'text-xs w-full py-1' : 'px-4 py-1.5'} rounded hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? 'Yükleniyor...' : 'Görüntüle'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {paginatedData.length > 0 && paginatedData.length < 3 && (
              [...Array(3 - paginatedData.length)].map((_, index) => (
                <div 
                  key={`empty-${index}`} 
                  className="border rounded p-3 h-[100px] bg-gray-50"
                />
              ))
            )}
            {filteredRequests.length === 0 && (
              <div className="col-span-1 flex items-center justify-center h-[340px] border rounded bg-gray-50">
                <div className="text-center text-gray-500 py-4">
                  {selectedStatus === 'ALL' 
                    ? 'Henüz görüntüleme talebi bulunmamaktadır.'
                    : `${selectedStatus === 'PENDING' ? 'Bekleyen' : 'Tamamlanan'} görüntüleme talebi bulunmamaktadır.`
                  }
                </div>
              </div>
            )}
          </div>
          
          {/* Sayfalandırma */}
          {totalPages > 1 && (
            <ReactPaginate
              breakLabel={<span className="px-2">...</span>}
              nextLabel={
                <span className={`flex items-center ${isSmallMobile ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} font-medium`}>
                  Sonraki <span className="ml-1">→</span>
                </span>
              }
              previousLabel={
                <span className={`flex items-center ${isSmallMobile ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} font-medium`}>
                  <span className="mr-1">←</span> Önceki
                </span>
              }
              onPageChange={handlePageClick}
              pageRangeDisplayed={isSmallMobile ? 1 : 3}
              marginPagesDisplayed={isSmallMobile ? 1 : 2}
              pageCount={totalPages}
              renderOnZeroPageCount={null}
              className="flex items-center justify-center gap-1 mt-4 select-none flex-wrap"
              pageClassName="flex"
              pageLinkClassName={`${isSmallMobile ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'} flex items-center justify-center font-medium text-gray-700 hover:bg-blue-50 rounded-md transition-colors duration-200`}
              activeLinkClassName="!bg-blue-500 !text-white hover:!bg-blue-600"
              previousClassName="flex items-center mr-1"
              nextClassName="flex items-center ml-1"
              previousLinkClassName={`flex items-center rounded-md transition-colors duration-200 ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
              nextLinkClassName={`flex items-center rounded-md transition-colors duration-200 ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
              disabledClassName="opacity-50"
              breakClassName="flex items-center text-gray-500"
              containerClassName="border-t pt-4 mt-4"
            />
          )}
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className={`font-semibold mb-4 ${isSmallMobile ? 'text-sm' : ''}`}>Yeni Görüntüleme Talebi</h3>
        <div className="space-y-3">
          <div>
            <label className={`block ${isSmallMobile ? 'text-xs' : 'text-sm'} mb-1 font-medium text-gray-700`}>Görüntüleme Türü</label>
            <select 
              name="imagingType"
              value={formData.imagingType}
              onChange={handleInputChange}
              className={`w-full border rounded p-2 ${isSmallMobile ? 'text-xs' : 'text-sm'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
            <label className={`block ${isSmallMobile ? 'text-xs' : 'text-sm'} mb-1 font-medium text-gray-700`}>Çekim Bölgesi</label>
            <input 
              type="text" 
              name="bodyPart"
              value={formData.bodyPart}
              onChange={handleInputChange}
              className={`w-full border rounded p-2 ${isSmallMobile ? 'text-xs' : 'text-sm'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              placeholder="Çekim yapılacak bölge"
            />
          </div>
          <div>
            <label className={`block ${isSmallMobile ? 'text-xs' : 'text-sm'} mb-1 font-medium text-gray-700`}>Talep Notları</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className={`w-full ${isSmallMobile ? 'h-16' : 'h-24'} border rounded p-2 ${isSmallMobile ? 'text-xs' : 'text-sm'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
              placeholder="Talep notları..."
            />
          </div>
          <div>
            <label className={`block ${isSmallMobile ? 'text-xs' : 'text-sm'} mb-1 font-medium text-gray-700`}>Öncelik Durumu</label>
            <select 
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className={`w-full border rounded p-2 ${isSmallMobile ? 'text-xs' : 'text-sm'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
            >
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Acil</option>
            </select>
          </div>
          <button 
            onClick={handleSubmit}
            className={`${
              isMobile ? 'w-full' : 'w-fit px-6'
            } ${isSmallMobile ? 'text-xs py-2' : 'py-2'} bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ${
              !isMobile && 'float-right'
            }`}
          >
            Görüntüleme Talebi Oluştur
          </button>
        </div>
      </div>

      {/* Detay Modalı */}
      <Modal
        title={
          <div className={`${isSmallMobile ? 'text-base' : 'text-lg'} font-semibold`}>
            Görüntüleme Detayları
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={isSmallMobile ? '95%' : 600}
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Görüntüleme Türü</p>
                <p className="text-base">{selectedRequest.imagingType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Çekim Bölgesi</p>
                <p className="text-base">{selectedRequest.bodyPart}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Durum</p>
                <p className={`text-base ${getStatusColor(selectedRequest.status)}`}>
                  {getStatusText(selectedRequest.status)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Öncelik</p>
                <p className="text-base">{selectedRequest.priority === 'URGENT' ? 'Acil' : 'Normal'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Talep Tarihi</p>
                <p className="text-base">{formatDate(selectedRequest)}</p>
              </div>
              {selectedRequest.completedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Tamamlanma Tarihi</p>
                  <p className="text-base">
                    {new Date(selectedRequest.completedAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              )}
            </div>
            {selectedRequest.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500">Notlar</p>
                <p className="text-base">{selectedRequest.notes}</p>
              </div>
            )}
            {selectedRequest.findings && (
              <div>
                <p className="text-sm font-medium text-gray-500">Bulgular</p>
                <p className="text-base">{selectedRequest.findings}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ImagingTab;