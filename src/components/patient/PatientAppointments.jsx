import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Select, Table } from 'antd';
import { Calendar, Search, Filter, AlertCircle, Check, X } from 'lucide-react';
import { getPatientProfile } from '../../services/patient-service';
import { useSelector } from 'react-redux';
import CreateReservationForm from './CreateReservationForm';
import './PatientAppointments.css';
import { cancelReservation } from '../../services/reservation-service';

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

  const fetchPatientDetails = async () => {
    // Hastanın randevu detaylarını API'den çeker ve state'e kaydeder.
    try {
      setLoading(true);
      const response = await getPatientProfile(patientId);
      setAppointments(response.reservations.sort((a, b) => {
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
      await cancelReservation(selectedAppointment.id);
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
      const doctorName = appointment.doctor.ad || '';
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

  // Tablo sütunlarını tanımlayan yapı
  const columns = [
    {
      title: 'Doktor', // Sütun başlığı
      dataIndex: 'doctor', // Verinin geldiği alan
      key: 'doctor', // Anahtar değeri
      render: (text) => `${text.ad} ${text.soyad}`, // Doktor adını ve soyadını birleştirip gösterir
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
        <div>
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

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

        <div className="bg-white rounded-lg shadow-sm p-4">
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
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Doktor veya Uzmanlık Ara"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="flex-1"
        />
        <Select
          placeholder="Durum Filtrele"
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-full md:w-48"
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
          className="bg-blue-500 text-white"
          onClick={handleCreateAppointment}
        >
          Randevu Oluştur
        </Button>
      </div>

      <style>{`
        @media (max-width: 610px) {
          .responsive-table {
            display: none;
          }
          .card-view {
            display: block;
          }
        }
        @media (min-width: 611px) {
          .responsive-table {
            display: block;
          }
          .card-view {
            display: none;
          }
        }
        .card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="responsive-table">
        <Table
          columns={columns}
          dataSource={getFilteredAppointments()}
          rowKey="id"
          loading={loading}
          pagination={{
            total: getFilteredAppointments().length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} randevu`,
          }}
          className="shadow-sm rounded-lg overflow-x-auto"
        />
      </div>

      <div className="card-view">
        {getFilteredAppointments().map((appointment) => (
          <div key={appointment.id} className="card p-4 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold">{`${appointment.doctor.ad} ${appointment.doctor.soyad}`}</div>
              <div className="space-x-2">
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
            <div className="text-sm text-gray-500 mb-1">Tarih: {appointment.reservationDate}</div>
            <div className="text-sm text-gray-500 mb-1">Saat: {appointment.reservationTime}</div>
            <div className="text-sm text-gray-500 mb-1">Durum: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>{getStatusText(appointment.status)}</span></div>
          </div>
        ))}
      </div>

      {/* CreateReservationForm Bileşeni */}
      {isFormVisible && (
        <CreateReservationForm 
          visible={isFormVisible}
          onCancel={() => setFormVisible(false)}
          onClose={() => setFormVisible(false)}
          onSubmit={handleAppointmentSubmit}
        />
      )}

      {/* Detay Modalı */}
      <Modal
        title="Randevu Detayları"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Kapat
          </Button>
        ]}
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                <div className="flex flex-col md:flex-row md:items-center">
                  <p className="text-sm text-gray-500 md:w-1/3">Doktor</p>
                  <p className="font-medium md:w-2/3 truncate">{`${selectedAppointment.doctor.ad} ${selectedAppointment.doctor.soyad}`}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <p className="text-sm text-gray-500 md:w-1/3">Uzmanlık</p>
                  <p className="font-medium md:w-2/3 truncate">{selectedAppointment.speciality}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <p className="text-sm text-gray-500 md:w-1/3">Tarih</p>
                  <p className="font-medium md:w-2/3 truncate">{selectedAppointment.reservationDate}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <p className="text-sm text-gray-500 md:w-1/3">Saat</p>
                  <p className="font-medium md:w-2/3 truncate">{selectedAppointment.reservationTime}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center col-span-1 md:col-span-2">
                  <p className="text-sm text-gray-500 md:w-1/3">Durum</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium md:w-2/3 truncate ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusText(selectedAppointment.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* İptal Modalı */}
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
            loading={loading}
            onClick={handleCancel}
          >
            İptal Et
          </Button>
        ]}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-yellow-600">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Bu randevuyu iptal etmek istediğinizden emin misiniz?</span>
          </div>
          {selectedAppointment && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
              <p><strong>Doktor:</strong> {`${selectedAppointment.doctor.ad} ${selectedAppointment.doctor.soyad}`}</p>
              <p><strong>Tarih:</strong> {selectedAppointment.reservationDate}</p>
              <p><strong>Saat:</strong> {selectedAppointment.reservationTime}</p>
              <p><strong>Uzmanlık:</strong> {selectedAppointment.speciality}</p>
            </div>
          )}
          <p className="text-sm text-gray-500">
            Not: İptal edilen randevular sistem tarafından otomatik olarak kapatılır ve tekrar aktif edilemez.
            Yeni bir randevu almanız gerekebilir.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default PatientAppointments;
