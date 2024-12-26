import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Select, DatePicker, TimePicker, Table, Dropdown } from 'antd';
import { Plus, MoreVertical } from 'lucide-react';
import { getAuthHeader } from '../../services/auth-header';
import { getDoctorReservations, updateReservation } from '../../services/reservation-service';
import { useSelector } from 'react-redux';
import CreateReservationForm from '../patient/CreateReservationForm';
import moment from 'moment';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [form] = Form.useForm();
  const doctorId = useSelector(state => state.auth.user.id.toString());
  const [isFormVisible, setFormVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getDoctorReservations(doctorId);
      const uniqueAppointments = response.filter((appointment, index, self) =>
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
  }, []);

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

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      await updateReservation(selectedAppointment.id, {
        ...values,
        reservationDate: values.reservationDate.format('YYYY-MM-DD'),
        reservationTime: values.reservationTime.format('HH:mm')
      }, {
        headers: getAuthHeader()
      });
      
      await fetchAppointments();
      setEditModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Randevu güncellenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      // Randevunun durumunu "CANCELLED" olarak güncelle
      await updateReservation(selectedAppointment.id, 
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

  // Edit Modal Component
  const EditModal = () => (
    <Modal
      title="Randevu Düzenle"
      open={editModalVisible}
      onCancel={() => {
        setEditModalVisible(false);
        form.resetFields();
      }}
      footer={[
        <Button key="cancel" onClick={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}>
          İptal
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={() => form.submit()}
        >
          Güncelle
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdate}
      >
        <Form.Item
          name="reservationDate"
          label="Randevu Tarihi"
          rules={[{ required: true, message: 'Lütfen tarih seçiniz' }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="reservationTime"
          label="Randevu Saati"
          rules={[{ required: true, message: 'Lütfen saat seçiniz' }]}
        >
          <TimePicker format="HH:mm" className="w-full" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Durum"
          rules={[{ required: true, message: 'Lütfen durum seçiniz' }]}
        >
          <Select>
            <Select.Option value="CONFIRMED">Onaylandı</Select.Option>
            <Select.Option value="PENDING">Beklemede</Select.Option>
            <Select.Option value="COMPLETED">Tamamlandı</Select.Option>
          </Select>
        </Form.Item>
      </Form>
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
        <Dropdown
          menu={{ 
            items: [
              { key: '1', label: 'Görüntüle' },
              { key: '2', label: 'Düzenle' },
              { key: '3', label: 'İptal Et', danger: true }
            ],
            onClick: ({ key }) => handleMenuClick(key, record)
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreVertical className="w-4 h-4" />} />
        </Dropdown>
      ),
    },
  ];

  const handleMenuClick = (key, record) => {
    setSelectedAppointment(record);
    switch (key) {
      case '1':
        setViewModalVisible(true);
        break;
      case '2':
        form.setFieldsValue({
          ...record,
          reservationDate: moment(record.reservationDate),
          reservationTime: moment(record.reservationTime, 'HH:mm')
        });
        setEditModalVisible(true);
        break;
      case '3':
        setCancelModalVisible(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Randevu Listesi</h3>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('tr-TR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex gap-2">
        <button 
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 gap-2 w-full sm:w-auto"
          onClick={() => setFormVisible(true)}
        >
          <Plus className="w-5 h-5" />
          Yeni Randevu Oluştur
        </button>
        </div>
      </div>

       {/* CreateReservationForm bileşeni */}
       <CreateReservationForm 
        visible={isFormVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={(data) => {
          console.log('Form verileri:', data);
          setFormVisible(false);
        }}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 pb-4">
        <Button className="bg-white">Tüm Randevular</Button>
        <Button className="bg-white">Bugün</Button>
        <Button className="bg-white">Bu Hafta</Button>
        <Button className="bg-white">Bu Ay</Button>
      </div>

      {/* Table */}
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
      <Table
        columns={columns}
        dataSource={appointments || []}
        rowKey="id"
        loading={loading}
        pagination={{
          total: appointments ? appointments.length : 0,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} randevu`,
        }}
        className="shadow-sm rounded-lg table-tight compact overflow-x-auto responsive-table"
        style={{ tableLayout: 'auto', width: '100%', padding: '0', margin: '0' }}
      />

      <div className="card-view hidden">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="card p-4 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold">{`${appointment.patientName} ${appointment.patientSurname}`}</div>
              <Dropdown
                menu={{ 
                  items: [
                    { key: '1', label: 'Görüntüle' },
                    { key: '2', label: 'Düzenle' },
                    { key: '3', label: 'İptal Et', danger: true }
                  ],
                  onClick: ({ key }) => handleMenuClick(key, appointment)
                }}
                trigger={['click']}
              >
                <Button type="text" icon={<MoreVertical className="w-4 h-4" />} />
              </Dropdown>
            </div>
            <div className="text-sm text-gray-500 mb-1">Tarih: {appointment.reservationDate}</div>
            <div className="text-sm text-gray-500 mb-1">Saat: {appointment.reservationTime}</div>
            <div className="text-sm text-gray-500 mb-1">Durum: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>{getStatusText(appointment.status)}</span></div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ViewModal />
      <EditModal />
      <CancelModal />
    </div>
  );
};

export default DoctorAppointments;