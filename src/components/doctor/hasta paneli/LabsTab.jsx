import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { createLabRequest } from '../../../services/doctor-service';
import { getLabRequestAll, getLabRequestPdfById } from '../../../services/technicians-service';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Modal } from 'antd';

const ITEMS_PER_PAGE = 3;

const LabsTab = () => {
  const isTablet = useMediaQuery({ maxWidth: 1200 });
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isExtraSmall = useMediaQuery({ maxWidth: 470 });
  const { patient, userId, patientId } = useSelector((state) => state.treatment);
  const [labResults, setLabResults] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLab, setSelectedLab] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    testPanel: '',
    priority: 'NORMAL',
    fastingStatus: 'AC',
    notes: ''
  });

  const fetchLabResults = async () => {
    try {
      const response = await getLabRequestAll(patientId);
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

     
      
      const response = await createLabRequest(labRequestData);
   
      
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
      // testPdfs array'i ve içinde eleman var mı kontrol et
      if (!lab.testPdfs || lab.testPdfs.length === 0) {
        toast.error('PDF bulunamadı');
        return;
      }

      // testPdfs array'inin ilk elemanının id'sini kullan
      const pdfId = lab.testPdfs[0].id;
      
      const response = await getLabRequestPdfById(patientId, pdfId);
      
      if (!response || !response.pdfData) {
        toast.error('PDF verisi bulunamadı');
        return;
      }

      // Base64'ten PDF oluştur
      const pdfContent = atob(response.pdfData);
      const bytes = new Uint8Array(pdfContent.length);
      for (let i = 0; i < pdfContent.length; i++) {
        bytes[i] = pdfContent.charCodeAt(i);
      }
      
      // PDF'i görüntüle
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      
      // Yeni pencerede aç
      const newWindow = window.open(pdfUrl, '_blank');
      
      // Pencere kapandığında URL'i temizle
      if (newWindow) {
        newWindow.onunload = () => {
          URL.revokeObjectURL(pdfUrl);
        };
      }

      // Yedek temizleme (30 saniye sonra)
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
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
  const paginatedData = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handleViewDetails = (lab) => {
    setSelectedLab(lab);
    setIsModalVisible(true);
  };

  return (
    <div className={`${isTablet ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}>
      <div className={`p-4 border rounded ${isExtraSmall ? 'text-sm' : ''}`}>
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} mb-4`}>
          <h3 className={`font-semibold ${isExtraSmall ? 'text-base' : ''}`}>Geçmiş Laboratuvar Sonuçları</h3>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`border rounded p-2 ${isExtraSmall ? 'w-full text-sm' : ''} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
          >
            <option value="ALL">Tümü</option>
            <option value="PENDING">Bekleyenler</option>
            <option value="COMPLETED">Tamamlananlar</option>
          </select>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 min-h-[340px]">
            {paginatedData.map((lab) => (
              <div key={lab.id} className={`border rounded p-3 ${isExtraSmall ? 'text-xs' : ''} h-[${isExtraSmall ? '130px' : '100px'}] bg-white flex flex-col justify-between`}>
                <div>
                  <div className={`${isExtraSmall ? 'flex flex-col gap-1' : 'flex items-center justify-between'} mb-2`}>
                    <div className={`${isExtraSmall ? 'flex flex-col' : 'flex items-center'} gap-2`}>
                      <span className="font-medium">{lab.testPanel}</span>
                      <span className={`${getStatusColor(lab.status)} ${isExtraSmall ? 'text-xs' : 'text-sm'}`}>
                        ({getStatusText(lab.status)})
                      </span>
                    </div>
                    <span className={`${isExtraSmall ? 'text-xs mt-1' : 'text-sm'} bg-gray-100 px-2 py-1 rounded text-gray-600`}>
                      {new Date(lab.createdAt).toLocaleString('tr-TR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className={`flex ${isExtraSmall ? 'flex-col' : 'justify-end'} gap-2`}>
                  <button
                    onClick={() => handleViewDetails(lab)}
                    className={`text-blue-500 hover:text-blue-600 ${isExtraSmall ? 'text-xs w-full py-1' : 'text-sm'} font-medium ${isExtraSmall ? 'border border-blue-500 rounded' : ''}`}
                  >
                    Detayları Görüntüle
                  </button>
                  {lab.status === 'COMPLETED' && lab.testPdfs && lab.testPdfs.length > 0 && (
                    <button 
                      onClick={() => handleViewPdf(lab)}
                      className={`bg-blue-500 text-white ${isExtraSmall ? 'text-xs w-full py-1' : 'px-4 py-1.5'} rounded hover:bg-blue-600 transition-colors duration-200`}
                    >
                      PDF Görüntüle
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
            {filteredResults.length === 0 && (
              <div className="col-span-1 flex items-center justify-center h-[340px] border rounded bg-gray-50">
                <div className="text-center text-gray-500 py-4">
                  {selectedStatus === 'ALL' 
                    ? 'Henüz laboratuvar sonucu bulunmamaktadır.'
                    : `${selectedStatus === 'PENDING' ? 'Bekleyen' : 'Tamamlanan'} laboratuvar sonucu bulunmamaktadır.`
                  }
                </div>
              </div>
            )}
          </div>
          
          {filteredResults.length > 0 && (
            <ReactPaginate
              breakLabel={<span className="px-2">...</span>}
              nextLabel={
                <span className={`flex items-center ${isExtraSmall ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} font-medium`}>
                  Sonraki <span className="ml-1">→</span>
                </span>
              }
              previousLabel={
                <span className={`flex items-center ${isExtraSmall ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} font-medium`}>
                  <span className="mr-1">←</span> Önceki
                </span>
              }
              onPageChange={handlePageClick}
              pageRangeDisplayed={isExtraSmall ? 1 : 3}
              marginPagesDisplayed={isExtraSmall ? 1 : 2}
              pageCount={totalPages}
              renderOnZeroPageCount={null}
              className="flex items-center justify-center gap-1 mt-4 select-none flex-wrap"
              pageClassName="flex"
              pageLinkClassName={`${isExtraSmall ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'} flex items-center justify-center font-medium text-gray-700 hover:bg-blue-50 rounded-md transition-colors duration-200`}
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

      <div className={`p-4 border rounded ${isExtraSmall ? 'text-sm' : ''}`}>
        <h3 className={`font-semibold mb-4 ${isExtraSmall ? 'text-base' : ''}`}>Yeni Laboratuvar Talebi</h3>
        <div className="space-y-4">
          <div>
            <label className={`block ${isExtraSmall ? 'text-xs' : 'text-sm'} mb-1 font-medium text-gray-700`}>Test Paneli</label>
            <select 
              className={`w-full border rounded p-2 ${isExtraSmall ? 'text-xs' : ''} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
              <label className={`block ${isExtraSmall ? 'text-xs' : 'text-sm'} mb-1 font-medium text-gray-700`}>Öncelik Durumu</label>
              <select 
                className={`w-full border rounded p-2 ${isExtraSmall ? 'text-xs' : ''} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Acil</option>
              </select>
            </div>

            <div>
              <label className={`block ${isExtraSmall ? 'text-xs' : 'text-sm'} mb-1 font-medium text-gray-700`}>Açlık Durumu</label>
              <select 
                className={`w-full border rounded p-2 ${isExtraSmall ? 'text-xs' : ''} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
            <label className={`block ${isExtraSmall ? 'text-xs' : 'text-sm'} mb-1 font-medium text-gray-700`}>Laboratuvar Notları</label>
            <textarea 
              className={`w-full ${isExtraSmall ? 'h-16' : 'h-24'} border rounded p-2 ${isExtraSmall ? 'text-xs' : ''} focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
            } ${isExtraSmall ? 'text-xs py-2' : 'py-2'} bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ${
              !isMobile && 'float-right'
            }`}
          >
            Laboratuvar Talebi Oluştur
          </button>
        </div>
      </div>

      {/* Detay Modalı */}
      <Modal
        title={
          <div className={`${isExtraSmall ? 'text-base' : 'text-lg'} font-semibold`}>
            Laboratuvar Test Detayları
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={isExtraSmall ? '95%' : 600}
      >
        {selectedLab && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Test Paneli</p>
                <p className="text-base">{selectedLab.testPanel}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Durum</p>
                <p className={`text-base ${getStatusColor(selectedLab.status)}`}>
                  {getStatusText(selectedLab.status)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Öncelik</p>
                <p className="text-base">{selectedLab.priority === 'URGENT' ? 'Acil' : 'Normal'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Açlık Durumu</p>
                <p className="text-base">
                  {selectedLab.fastingStatus === 'AC' ? 'Aç' : selectedLab.fastingStatus === 'TOK' ? 'Tok' : 'Farketmez'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Talep Tarihi</p>
                <p className="text-base">
                  {new Date(selectedLab.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              {selectedLab.completedAt && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Tamamlanma Tarihi</p>
                  <p className="text-base">
                    {new Date(selectedLab.completedAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              )}
            </div>
            {selectedLab.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500">Notlar</p>
                <p className="text-base">{selectedLab.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LabsTab;