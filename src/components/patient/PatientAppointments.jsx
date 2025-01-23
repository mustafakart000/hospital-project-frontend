import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Select, Table, Card, Pagination } from 'antd';
import { Calendar, Search, Filter, Check, X, User, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import CreateReservationForm from './CreateReservationForm';
import './PatientAppointments.css';
import { getAuthHeader } from '../../services/auth-header';
import { getReservationsByPatientId, updateReservation } from '../../services/reservation-service';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]); // Randevuları tutan state
  const [loading, setLoading] = useState(false); // Yüklenme durumunu tutan state
  const [searchText, setSearchText] = useState(''); // Arama metnini tutan state
  const [filterStatus, setFilterStatus] = useState('all'); // Filtre durumunu tutan state
  const [viewModalVisible, setViewModalVisible] = useState(false); // Görüntüleme modalının görünürlüğünü tutan state
  const [cancelModalVisible, setCancelModalVisible] = useState(false); // İptal modalının görünürlüğünü tutan state
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Seçili randevuyu tutan state
  const [isFormVisible, setFormVisible] = useState(false); // Formun görünürlüğünü tutan state
  const patientId = useSelector(state => state.auth.user.id.toString()); // Hastanın ID'sini tutan state
  const listRefreshToken = useSelector(state => state.misc.listRefreshToken);
  const isMobile = useMediaQuery({ maxWidth: 610 });
  const isTablet = useMediaQuery({ maxWidth: 1310 });
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPatientDetails = async () => {
    // Hastanın randevu detaylarını API'den çeker ve state'e kaydeder.
    try {
      setLoading(true);
      const response = await getReservationsByPatientId(patientId);
      setAppointments(response.sort((a, b) => {
        const dateA = new Date(`${a.reservationDate}T${a.reservationTime}`);
        const dateB = new Date(`${b.reservationDate}T${b.reservationTime}`);
        return dateB - dateA;
      }));
    } catch (error) {
      console.error('Hasta bilgileri yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hasta ID'si değiştiğinde hastanın randevu detaylarını yeniden getirir.
  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  useEffect(() => {
    if (listRefreshToken) {
      fetchPatientDetails();
    }
  }, [listRefreshToken]);

  const getStatusColor = (status) => {
    // Randevu durumuna göre uygun renk sınıfını döndürür.
    const colors = {
      'CONFIRMED': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    // Randevu durumuna göre uygun metni döndürür.
    const texts = {
      'CONFIRMED': 'Onaylandı',
      'PENDING': 'Beklemede',
      'CANCELLED': 'İptal Edildi',
      'COMPLETED': 'Tamamlandı'
    };
    return texts[status] || status;
  };

  const handleCancel = async () => {
    // Seçili randevuyu iptal eder ve güncellenmiş randevu listesini çeker.
    try {
      setLoading(true);

      await updateReservation(selectedAppointment.id, 
        {
          reservationDate: selectedAppointment.reservationDate,
          reservationTime: selectedAppointment.reservationTime,
          status: 'CANCELLED',
          speciality: selectedAppointment.speciality,
          doctor: {
            id: selectedAppointment.doctorId,
            ad: selectedAppointment.doctorName,
            soyad: selectedAppointment.doctorSurname
          },
          patient: {
            id: selectedAppointment.patientId,
            ad: selectedAppointment.patientName,
            soyad: selectedAppointment.patientSurname
          }
        }, 
        {
          headers: getAuthHeader()
        }
      );
      await fetchPatientDetails();
      setCancelModalVisible(false);

    } catch (error) {
      console.error('Randevu iptal edilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAppointments = () => {
    // Arama metni ve durum filtresine göre randevuları filtreler.
    return appointments.filter(appointment => {
      const doctorName = appointment.doctorName || '';
      const speciality = appointment.speciality || '';

      const matchesSearch = 
        doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
        speciality.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const stats = {
    upcoming: appointments.filter(a => a.status === 'CONFIRMED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
  };

  const handleCreateAppointment = () => {
    // Yeni randevu oluşturma formunu görünür yapar.
    setFormVisible(true);
  };

  const handleAppointmentSubmit = (data) => {
    setFormVisible(false);
    setAppointments(prevAppointments => [data, ...prevAppointments]); // Yeni randevuyu en üste ekle
    fetchPatientDetails(); // Randevuların güncellenmesi için fetchPatientDetails fonksiyonunu çağır
  };

  // Pagination için veri hesaplama
  const paginatedData = getFilteredAppointments().slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Tablo sütunlarını tanımlayan yapı
  const columns = [
    {
      title: 'Doktor', // Sütun başlığı
      dataIndex: 'doctorName', // Verinin geldiği alan
      key: 'doctorName', // Anahtar değeri
      render: (text, record) => `${record.doctorName} ${record.doctorSurname}`, // Doktor adını ve soyadını birleştirip gösterir
    },
    {
      title: 'Uzmanlık', // Sütun başlığı
      dataIndex: 'speciality', // Verinin geldiği alan
      key: 'speciality', // Anahtar değeri
    },
    {
      title: 'Tarih', // Sütun başlığı
      dataIndex: 'reservationDate', // Verinin geldiği alan
      key: 'reservationDate', // Anahtar değeri
    },
    {
      title: 'Saat', // Sütun başlığı
      dataIndex: 'reservationTime', // Verinin geldiği alan
      key: 'reservationTime', // Anahtar değeri
    },
    {
      title: 'Durum', // Sütun başlığı
      dataIndex: 'status', // Verinin geldiği alan
      key: 'status', // Anahtar değeri
      render: (text) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(text)}`}>
          {getStatusText(text)} {/* Durum metnini ve rengini gösterir */}
        </span>
      ),
    },
    {
      title: 'İşlemler', // Sütun başlığı
      key: 'actions', // Anahtar değeri
      render: (text, record) => (
        <div className='space-x-2'>
          <Button
            size="small"
            onClick={() => {
              setSelectedAppointment(record); // Seçili randevuyu ayarlar
              setViewModalVisible(true); // Görüntüleme modali açar
            }}
          >
            Detay
          </Button>
          {record.status === 'CONFIRMED' && ( // Eğer randevu onaylıysa
            <Button
              size="small"
              danger
              onClick={() => {
                setSelectedAppointment(record); // Seçili randevuyu ayarlar
                setCancelModalVisible(true); // İptal modali açar
              }}
            >
              İptal Et
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Modal bileşenleri
  const ViewModal = () => {
    return (
      <Modal
        title="Randevu Detayları"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewModalVisible(false)}>
            Kapat
          </Button>
        ]}
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Doktor</p>
              <p className="font-medium">{`${selectedAppointment.doctorName} ${selectedAppointment.doctorSurname}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Uzmanlık</p>
              <p className="font-medium">{selectedAppointment.speciality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tarih ve Saat</p>
              <p className="font-medium">{`${selectedAppointment.reservationDate} ${selectedAppointment.reservationTime}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Durum</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                {getStatusText(selectedAppointment.status)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    );
  };

  const CancelModal = () => {
    return (
      <Modal
        title="Randevu İptali"
        open={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setCancelModalVisible(false)}>
            Vazgeç
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            danger
            onClick={handleCancel}
            loading={loading}
          >
            İptal Et
          </Button>
        ]}
      >
        <p>Bu randevuyu iptal etmek istediğinizden emin misiniz?</p>
      </Modal>
    );
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* İstatistik Kartları */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'} gap-4 mb-6`}>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-50">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Yaklaşan</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-600">{stats.upcoming}</span>
                <span className="text-sm text-gray-500">Randevu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-50">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tamamlanan</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
                <span className="text-sm text-gray-500">Randevu</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow-sm p-4 ${isTablet && !isMobile ? 'col-span-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-50">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">İptal Edilen</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-red-600">{stats.cancelled}</span>
                <span className="text-sm text-gray-500">Randevu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arama, Filtre ve Randevu Oluştur Butonu */}
      <div className={`${isMobile || isTablet ? 'flex flex-col space-y-4' : 'flex items-center'} gap-4`}>
        <Input
          placeholder="Doktor veya Uzmanlık Ara"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className={`${isMobile || isTablet ? 'w-full' : 'flex-1'}`}
        />
        <Select
          placeholder="Durum Filtrele"
          value={filterStatus}
          onChange={setFilterStatus}
          className={`${isMobile || isTablet ? 'w-full' : 'w-48'}`}
          suffixIcon={<Filter className="w-4 h-4" />}
        >
          <Select.Option value="all">Tümü</Select.Option>
          <Select.Option value="CONFIRMED">Onaylı</Select.Option>
          <Select.Option value="PENDING">Beklemede</Select.Option>
          <Select.Option value="COMPLETED">Tamamlandı</Select.Option>
          <Select.Option value="CANCELLED">İptal Edildi</Select.Option>
        </Select>
        <Button
          type="primary"
          onClick={handleCreateAppointment}
          className={`
            ${isMobile || isTablet ? 'w-[200px] mx-auto' : 'w-[180px]'}
            bg-blue-500 hover:bg-blue-600 
            text-white font-medium
            shadow-sm hover:shadow
            transition-all duration-200
            flex items-center justify-center gap-2
            ${isMobile ? 'py-4' : 'py-2'}
          `}
        >
          <Calendar className="w-4 h-4" />
          <span>Randevu Oluştur</span>
        </Button>
      </div>

      {/* Randevu Listesi */}
      {isMobile || isTablet ? (
        <div className="space-y-4">
          {/* Kart listesi */}
          {paginatedData.map((appointment) => (
            <Card key={appointment.id} className="bg-white shadow-sm">
              <div className="space-y-4">
                {/* Doktor Bilgileri */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{`${appointment.doctorName} ${appointment.doctorSurname}`}</p>
                      <p className="text-sm text-gray-500">{appointment.speciality}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                {/* Randevu Zamanı */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{appointment.reservationDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{appointment.reservationTime}</span>
                  </div>
                </div>

                {/* İşlem Butonları */}
                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setViewModalVisible(true);
                    }}
                  >
                    Detay
                  </Button>
                  {appointment.status === 'CONFIRMED' && (
                    <Button
                      size="small"
                      danger
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setCancelModalVisible(true);
                      }}
                    >
                      İptal Et
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Mobil Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={getFilteredAppointments().length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              size={isMobile ? "small" : "default"}
              showSizeChanger={false}
              showTotal={(total) => (
                <span className="text-sm text-gray-500">
                  Toplam {total} randevu
                </span>
              )}
            />
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={getFilteredAppointments()}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            total: getFilteredAppointments().length,
            pageSize: pageSize,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} randevu`,
          }}
          className="shadow-sm rounded-lg overflow-x-auto"
        />
      )}

      {/* Modals */}
      <ViewModal />
      <CancelModal />
      
      {/* CreateReservationForm */}
      {isFormVisible && (
        <CreateReservationForm 
          visible={isFormVisible}
          onCancel={() => setFormVisible(false)}
          onClose={() => setFormVisible(false)}
          onSubmit={handleAppointmentSubmit}
        />
      )}
    </div>
  );
};

export default PatientAppointments;
