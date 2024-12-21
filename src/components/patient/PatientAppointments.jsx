import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Input, Select } from 'antd';
import { Calendar, Clock, User, Search, Filter, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { getAuthHeader } from '../../services/auth-header';
import { config } from '../../helpers/config';
import PropTypes from 'prop-types';

const PatientAppointments = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const BASE_URL = config.api.baseUrl;

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/reservations/getByPatientId/${patientId}`, {
        headers: getAuthHeader(),
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Randevular yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
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
      await fetchAppointments();
      setCancelModalVisible(false);
    } catch (error) {
      console.error('Randevu iptal edilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      const matchesSearch = 
        appointment.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
        appointment.speciality.toLowerCase().includes(searchText.toLowerCase());
      
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
            <div className="font-medium">{`${record.doctorName} ${record.doctorSurname}`}</div>
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

  return (
    <div className="space-y-6">
      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-500">Yaklaşan Randevu</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-500">Tamamlanan</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-500">İptal Edilen</div>
          </div>
        </Card>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-4">
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
          className="w-full sm:w-48"
          suffixIcon={<Filter className="w-4 h-4" />}
        >
          <Select.Option value="all">Tümü</Select.Option>
          <Select.Option value="CONFIRMED">Onaylı</Select.Option>
          <Select.Option value="PENDING">Beklemede</Select.Option>
          <Select.Option value="COMPLETED">Tamamlandı</Select.Option>
          <Select.Option value="CANCELLED">İptal Edildi</Select.Option>
        </Select>
      </div>

      {/* Randevu Tablosu */}
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
        className="shadow-sm rounded-lg"
      />

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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Doktor</p>
                  <p className="font-medium">{`${selectedAppointment.doctorName} ${selectedAppointment.doctorSurname}`}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Uzmanlık</p>
                  <p className="font-medium">{selectedAppointment.speciality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tarih</p>
                  <p className="font-medium">{selectedAppointment.reservationDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Saat</p>
                  <p className="font-medium">{selectedAppointment.reservationTime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Durum</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
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
              <p><strong>Doktor:</strong> {`${selectedAppointment.doctorName} ${selectedAppointment.doctorSurname}`}</p>
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

PatientAppointments.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default PatientAppointments;