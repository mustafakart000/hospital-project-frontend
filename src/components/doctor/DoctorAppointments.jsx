import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Table, Card, Pagination } from 'antd';
import { Calendar, Clock, User } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { getAuthHeader } from '../../services/auth-header';
import { getDoctorReservations, updateReservation } from '../../services/reservation-service';
import { useSelector } from 'react-redux';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorId = useSelector(state => state.auth.user.id.toString());
  const isMobile = useMediaQuery({ maxWidth: 610 });
  const pageSize = 10;

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getDoctorReservations(doctorId);
      const today = new Date();
      const todayDateString = today.toISOString().split('T')[0];
      let filteredAppointments = response;

      if (selectedFilter === 'today') {
        filteredAppointments = response.filter(appointment => appointment.reservationDate === todayDateString);
      } else if (selectedFilter === 'week') {
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        filteredAppointments = response.filter(appointment => {
          const appointmentDate = new Date(appointment.reservationDate);
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        });
      } else if (selectedFilter === 'month') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filteredAppointments = response.filter(appointment => {
          const appointmentDate = new Date(appointment.reservationDate);
          return appointmentDate >= startOfMonth && appointmentDate <= endOfMonth;
        });
      }

      const uniqueAppointments = filteredAppointments.filter((appointment, index, self) =>
        index === self.findIndex((a) => (
          a.id === appointment.id
        ))
      );
      setAppointments(uniqueAppointments);
    } catch (error) {
      console.error('Randevular yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedFilter]);

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
      await updateReservation(selectedAppointment.id, 
        {
          reservationDate: selectedAppointment.reservationDate,
          reservationTime: selectedAppointment.reservationTime,
          status: 'CANCELLED',
          speciality: selectedAppointment.speciality,
          doctor: {
            id: doctorId,
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
      
      await fetchAppointments();
      setCancelModalVisible(false);
    } catch (error) {
      console.error('Randevu iptal edilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  // View Modal Component
  const ViewModal = () => (
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
          <div>
            <p className="text-sm text-gray-500">Hasta</p>
            <p className="font-medium">{`${selectedAppointment.patientName} ${selectedAppointment.patientSurname}`}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tarih</p>
            <p className="font-medium">{selectedAppointment.reservationDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Saat</p>
            <p className="font-medium">{selectedAppointment.reservationTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Uzmanlık</p>
            <p className="font-medium">{selectedAppointment.speciality}</p>
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

  // Cancel Modal Component
  const CancelModal = () => (
    <Modal
      title="Randevu İptali"
      open={cancelModalVisible}
      onCancel={() => setCancelModalVisible(false)}
      footer={[
        <Button 
          key="back" 
          onClick={() => setCancelModalVisible(false)}
        >
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
        <div className="text-red-600 font-medium">
          Bu randevuyu iptal etmek istediğinizden emin misiniz?
        </div>
        {selectedAppointment && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-2">
            <p><strong>Hasta:</strong> {`${selectedAppointment.patientName} ${selectedAppointment.patientSurname}`}</p>
            <p><strong>Tarih:</strong> {selectedAppointment.reservationDate}</p>
            <p><strong>Saat:</strong> {selectedAppointment.reservationTime}</p>
            <p><strong>Uzmanlık:</strong> {selectedAppointment.speciality}</p>
            <div className="mt-2">
              <strong>Mevcut Durum: </strong>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                {getStatusText(selectedAppointment.status)}
              </span>
            </div>
          </div>
        )}
        <div className="text-sm text-gray-500 mt-4">
          Not: Bu işlem geri alınamaz ve randevu iptal edildiğinde hasta bilgilendirilecektir.
        </div>
      </div>
    </Modal>
  );

  const columns = [
    {
      title: 'Hasta',
      key: 'patient',
      render: (record) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{`${record.patientName} ${record.patientSurname}`}</span>
        </div>
      ),
    },
    {
      title: 'Tarih',
      dataIndex: 'reservationDate',
      key: 'reservationDate',
      render: (text) => (
        <div className="flex items-center space-x-2">
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
        <div className="flex space-x-2">
          <Button 
            size="small"
            onClick={() => handleMenuClick('1', record)}
          >
            Görüntüle
          </Button>
          {record.status !== 'CANCELLED' && record.status !== 'COMPLETED' && (
            <Button 
              size="small"
              danger
              onClick={() => handleMenuClick('3', record)}
            >
              İptal Et
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleMenuClick = (key, record) => {
    setSelectedAppointment(record);
    switch (key) {
      case '1':
        setViewModalVisible(true);
        break;
      case '3':
        setCancelModalVisible(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex justify-between items-center'}`}>
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Randevular</h3>
            <p className="text-sm text-gray-500">Randevu listesi ve detaylar</p>
          </div>
        </div>
        <Select
          value={selectedFilter}
          onChange={setSelectedFilter}
          className={`${isMobile ? 'w-full' : 'w-40'}`}
        >
          <Select.Option value="today">Bugün</Select.Option>
          <Select.Option value="week">Bu Hafta</Select.Option>
          <Select.Option value="month">Bu Ay</Select.Option>
        </Select>
      </div>

      {/* Appointments List */}
      {isMobile ? (
        <div className="space-y-4">
          {appointments.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((appointment) => (
            <Card key={appointment.id} className="bg-white shadow-sm">
              <div className="space-y-4">
                {/* Hasta Bilgileri */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{`${appointment.patientName} ${appointment.patientSurname}`}</p>
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
                  <Button size="small" onClick={() => handleMenuClick('1', appointment)}>
                    Görüntüle
                  </Button>
                  {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                    <Button 
                      size="small" 
                      danger 
                      onClick={() => handleMenuClick('3', appointment)}
                    >
                      İptal Et
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Mobile Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={appointments.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              size="small"
              showSizeChanger={false}
            />
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            total: appointments.length,
            pageSize: pageSize,
            onChange: setCurrentPage,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} randevu`
          }}
          className="bg-white shadow-sm rounded-lg"
        />
      )}

      {/* Modals */}
      <ViewModal />
      <CancelModal />
    </div>
  );
};

export default DoctorAppointments;