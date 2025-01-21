import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { createLabRequest } from '../../../services/doctor-service';
import { getLabRequestAll, getLabRequestPdfById } from '../../../services/technicians-service';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const ITEMS_PER_PAGE = 3;

const LabsTab = () => {
  const isTablet = useMediaQuery({ maxWidth: 1200 });
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isExtraSmall = useMediaQuery({ maxWidth: 470 });
  const { patient, userId, patientId } = useSelector((state) => state.treatment);
  const [labResults, setLabResults] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    testPanel: '',
    priority: 'NORMAL',
    fastingStatus: 'AC',
    notes: ''
  });

  const fetchLabResults = async () => {
    try {
      const response = await getLabRequestAll(patientId);
      console.log("Lab sonuçları:", response);
      setLabResults(response);
    } catch (error) {
      console.error('Lab sonuçları alınamadı:', error);
      toast.error('Lab sonuçları yüklenirken bir hata oluştu');
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchLabResults();
    }
  }, [patientId]);

  const handleTestPanelChange = (e) => {
    setFormData(prev => ({ ...prev, testPanel: e.target.value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.testPanel) {
        toast.error('Lütfen bir test paneli seçiniz');
        return;
      }

      const labRequestData = {
        patientId: patientId,
        doctorId: userId,
        reservationId: patient.reservationId,
        testPanel: formData.testPanel,
        priority: formData.priority,
        fastingStatus: formData.fastingStatus,
        notes: formData.notes
      };

      console.log('Gönderilen veri:', labRequestData);
      
      const response = await createLabRequest(labRequestData);
      console.log('Sunucu yanıtı:', response);
      
      if (response) {
        toast.success('Laboratuvar talebi başarıyla oluşturuldu');
        await fetchLabResults(); // Sonuçları hemen güncelle
        
        
        setFormData({
          testPanel: '',
          priority: 'NORMAL',
          fastingStatus: 'AC',
          notes: ''
        });
      }
    } catch (error) {
      toast.error('Laboratuvar talebi oluşturulurken bir hata oluştu');
      console.error('Laboratuvar talebi oluşturma hatası:', error);
    }
  };

  const handleViewPdf = async (lab) => {
    try {
      // API'den PDF verisini al
      const response = await getLabRequestPdfById(patientId, lab.id);
      
      // Gelen veriyi Blob'a çevir
      const blob = new Blob([response], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      
      // Yeni pencerede aç
      const newWindow = window.open(fileURL, '_blank');
      
      // Bellek temizliği
      if (newWindow) {
        newWindow.onunload = () => {
          URL.revokeObjectURL(fileURL);
        };
      }

      // Yedek temizleme (30 saniye sonra)
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 30000);
      
    } catch (error) {
      console.error('PDF görüntüleme hatası:', error);
      toast.error('PDF görüntülenirken bir hata oluştu');
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

  const filteredResults = labResults
    .sort((a, b) => {
      const dateA = a.status === 'COMPLETED' ? new Date(a.completedAt) : new Date(a.createdAt);
      const dateB = b.status === 'COMPLETED' ? new Date(b.completedAt) : new Date(b.createdAt);
      return dateB - dateA;
    })
    .filter(result => {
      if (selectedStatus === 'ALL') return true;
      return result.status === selectedStatus;
    });

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  return (
    <div className={`${isTablet ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}>
      <div className={`p-4 border rounded ${isExtraSmall ? 'text-sm' : ''}`}>
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} mb-4`}>
          <h3 className={`font-semibold ${isExtraSmall ? 'text-base' : ''}`}>Geçmiş Laboratuvar Sonuçları</h3>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`border rounded p-2 ${isExtraSmall ? 'w-full text-sm' : ''}`}
          >
            <option value="ALL">Tümü</option>
            <option value="PENDING">Bekleyenler</option>
            <option value="COMPLETED">Tamamlananlar</option>
          </select>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {paginatedResults.map((lab) => (
              <div key={lab.id} className={`border rounded p-3 ${isExtraSmall ? 'text-xs' : ''}`}>
                <div className="flex flex-col">
                  <div className={`${isExtraSmall ? 'flex flex-col gap-2' : 'flex items-center justify-between'} mb-2`}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{lab.testPanel}</span>
                      <span className={`${isExtraSmall ? 'text-xs' : 'text-sm'} ${getStatusColor(lab.status)}`}>
                        ({getStatusText(lab.status)})
                      </span>
                    </div>
                    <span className={`${isExtraSmall ? 'text-xs' : 'text-sm'} bg-gray-100 px-2 py-1 rounded text-gray-600`}>
                      {new Date(lab.createdAt).toLocaleString('tr-TR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {lab.notes && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Not:</span> {lab.notes}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Öncelik: {lab.priority === 'URGENT' ? 'Acil' : 'Normal'}
                  </p>
                  {lab.status === 'COMPLETED' && (
                    <div className="flex justify-end mt-2">
                      <button 
                        onClick={() => handleViewPdf(lab)}
                        className="bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600 transition-colors duration-200"
                      >
                        PDF Görüntüle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {[...Array(3 - paginatedResults.length)].map((_, index) => (
            <div key={`empty-${index}`} className="border rounded p-3 h-[120px] bg-gray-50">
              <div className="h-full flex items-center justify-center text-gray-400">
                
              </div>
            </div>
          ))}
          {filteredResults.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              {selectedStatus === 'ALL' 
                ? 'Henüz laboratuvar sonucu bulunmamaktadır.'
                : `${selectedStatus === 'PENDING' ? 'Bekleyen' : 'Tamamlanan'} laboratuvar sonucu bulunmamaktadır.`
              }
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
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
            </div>
          )}
        </div>
      </div>

      <div className={`p-4 border rounded ${isExtraSmall ? 'text-sm' : ''}`}>
        <h3 className={`font-semibold mb-4 ${isExtraSmall ? 'text-base' : ''}`}>Yeni Laboratuvar Talebi</h3>
        <div className="space-y-4">
          <div>
            <label className={`block ${isExtraSmall ? 'text-xs' : 'text-sm'} mb-1`}>Test Paneli</label>
            <select 
              className={`w-full border rounded p-2 ${isExtraSmall ? 'text-xs' : ''}`}
              name="testPanel"
              value={formData.testPanel}
              onChange={handleTestPanelChange}
            >
              <option value="">Test Paneli Seçiniz</option>
              <option value="TAM_KAN_SAYIMI">Tam Kan Sayımı</option>
              <option value="HORMON_TESTLERI">Hormon Testleri</option>
              <option value="BIYOKIMYA">Biyokimya</option>
              <option value="IDRAR_TAHLILI">İdrar Tahlili</option>
              <option value="KOAGULASYON">Koagülasyon</option>
              <option value="SEDIMANTASYON">Sedimantasyon</option>
              <option value="CRP">CRP</option>
            </select>
          </div>
          
          <div className={`${!isMobile ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
            <div>
              <label className={`block ${isExtraSmall ? 'text-xs' : 'text-sm'} mb-1`}>Öncelik Durumu</label>
              <select 
                className={`w-full border rounded p-2 ${isExtraSmall ? 'text-xs' : ''}`}
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Acil</option>
              </select>
            </div>

            <div>
              <label className={`block ${isExtraSmall ? 'text-xs' : 'text-sm'} mb-1`}>Açlık Durumu</label>
              <select 
                className={`w-full border rounded p-2 ${isExtraSmall ? 'text-xs' : ''}`}
                name="fastingStatus"
                value={formData.fastingStatus}
                onChange={handleInputChange}
              >
                <option value="AC">Aç</option>
                <option value="TOK">Tok</option>
                <option value="FARKETMEZ">Farketmez</option>
              </select>
            </div>
          </div>

            <div>
              <label className={`block ${isExtraSmall ? 'text-xs' : 'text-sm'} mb-1`}>Laboratuvar Notları</label>
              <textarea 
                className={`w-full h-24 border rounded p-2 ${isExtraSmall ? 'text-xs' : ''}`}
                placeholder="Laboratuvar talep notları..."
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          
            <button 
              onClick={handleSubmit}
              className={`${
                isMobile ? 'w-full' : 'w-fit px-6'
              } bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
                !isMobile && 'float-right'
              } ${isExtraSmall ? 'text-xs' : ''}`}
            >
              Laboratuvar Talebi Oluştur
            </button>
        </div>
      </div>
    </div>
  );
};

export default LabsTab;