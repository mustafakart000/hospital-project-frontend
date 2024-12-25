import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, Select } from 'antd';
import { Calendar, Clock, User, Search, Filter, AlertCircle, Check, X } from 'lucide-react';
import axios from 'axios';
import { getAuthHeader } from '../../services/auth-header';
import { config } from '../../helpers/config';
import { getPatientProfile } from '../../services/patient-service';
import { useSelector } from 'react-redux';
import CreateReservationForm from './CreateReservationForm';
import './PatientAppointments.css';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const patientId = useSelector(state => state.auth.user.id.toString());
  const BASE_URL = config.api.baseUrl;

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const response = await getPatientProfile(patientId);
      setAppointments(response.reservations);
    } catch (error) {
      console.error('Hasta bilgileri yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const getStatusColor = (status) => {
    const colors = {
      'CONFIRMED': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'CONFIRMED': 'Onaylandı',
      'PENDING': 'Beklemede',
      'CANCELLED': 'İptal Edildi',
      'COMPLETED': 'Tamamlandı'
    };
    return texts[status] || status;
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${BASE_URL}/reservations/update/${selectedAppointment.id}`,
        {
          ...selectedAppointment,
          status: 'CANCELLED'
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

const columns = [
  {
    title: 'Doktor',
    key: 'doctor',
    render: (record) => (
      <div className="flex items-center space-x-2">
        <User className="w-4 h-4 text-gray-400" />
        <div>
          <div className="font-medium">{`${record.doctor.ad} ${record.doctor.soyad}`}</div>
          <div className="text-sm text-gray-500">{record.speciality}</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Tarih',
    dataIndex: 'reservationDate',
    key: 'reservationDate',
    render: (text) => (
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: 'Saat',
    dataIndex: 'reservationTime',
    key: 'reservationTime',
    render: (text) => (
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: 'Durum',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {getStatusText(status)}
      </span>
    ),
  },
  {
    title: 'İşlemler',
    key: 'actions',
    render: (_, record) => (
      <div className="space-x-2">
        <Button
          size="small"
          onClick={() => {
            setSelectedAppointment(record);
            setViewModalVisible(true);
          }}
        >
          Detay
        </Button>
        {record.status === 'CONFIRMED' && (
          <Button
            size="small"
            danger
            onClick={() => {
              setSelectedAppointment(record);
              setCancelModalVisible(true);
            }}
          >
            İptal Et
          </Button>
        )}
      </div>
    ),
  },
];

  const stats = {
    upcoming: appointments.filter(a => a.status === 'CONFIRMED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
  };

  const handleCreateAppointment = () => {
    setFormVisible(true);
  };

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

      {/* Randevular Tablosu */}
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

      {/* CreateReservationForm Bileşeni */}
      {isFormVisible && (
        <CreateReservationForm 
          visible={isFormVisible}
          onCancel={() => setFormVisible(false)}
          onClose={() => setFormVisible(false)}
          onSubmit={(data) => {
            console.log('Yeni randevu verileri:', data);
            setFormVisible(false);
            fetchPatientDetails();
          }}
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
