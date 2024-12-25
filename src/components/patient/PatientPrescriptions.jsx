import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Modal, Input, Select } from 'antd';
import { Calendar, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { getAuthHeader } from '../../services/auth-header';
import { config } from '../../helpers/config';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const BASE_URL = config.api.baseUrl;
  const patientId = useSelector(state => state.auth.user.id.toString());

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/prescriptions/getByPatientId/${patientId}`, {
        headers: getAuthHeader(),
      });
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Reçeteler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'EXPIRED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'ACTIVE': 'Aktif',
      'EXPIRED': 'Süresi Dolmuş',
      'COMPLETED': 'Tamamlandı'
    };
    return texts[status] || status;
  };

  const getFilteredPrescriptions = () => {
    return prescriptions.filter(prescription => {
      const matchesSearch = 
        prescription.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
        prescription.diagnosis.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  // İlaç kullanım durumu hesaplama
  const calculateUsageProgress = (medication) => {
    const totalDays = moment(medication.endDate).diff(moment(medication.startDate), 'days');
    const passedDays = moment().diff(moment(medication.startDate), 'days');
    return Math.min(Math.round((passedDays / totalDays) * 100), 100);
  };

  const columns = [
    {
      title: 'Tarih',
      dataIndex: 'prescriptionDate',
      key: 'prescriptionDate',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{moment(text).format('DD.MM.YYYY')}</span>
        </div>
      ),
    },
    {
      title: 'Doktor',
      key: 'doctor',
      render: (record) => (
        <div>
          <div className="font-medium">{record.doctorName}</div>
          <div className="text-sm text-gray-500">{record.department}</div>
        </div>
      ),
    },
    {
      title: 'Tanı',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (text) => (
        <Tag className="rounded-full">{text}</Tag>
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
        <Button
          type="link"
          onClick={() => {
            setSelectedPrescription(record);
            setViewModalVisible(true);
          }}
        >
          Detay
        </Button>
      ),
    },
  ];

  // İstatistik kartları için veriler
  const stats = {
    active: prescriptions.filter(p => p.status === 'ACTIVE').length,
    completed: prescriptions.filter(p => p.status === 'COMPLETED').length,
    expired: prescriptions.filter(p => p.status === 'EXPIRED').length,
  };

  return (
    <div className="space-y-6">
      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-500">Aktif Reçete</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-gray-500">Tamamlanan</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <div className="text-sm text-gray-500">Süresi Dolmuş</div>
          </div>
        </Card>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Doktor veya Tanı Ara"
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
          <Select.Option value="ACTIVE">Aktif</Select.Option>
          <Select.Option value="COMPLETED">Tamamlanan</Select.Option>
          <Select.Option value="EXPIRED">Süresi Dolmuş</Select.Option>
        </Select>
      </div>

      {/* Reçete Tablosu */}
      <Table
        columns={columns}
        dataSource={getFilteredPrescriptions()}
        rowKey="id"
        loading={loading}
        pagination={{
          total: getFilteredPrescriptions().length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} reçete`,
        }}
        className="bg-white shadow-sm rounded-lg"
      />

      {/* Detay Modalı */}
      <Modal
        title="Reçete Detayları"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Kapat
          </Button>
        ]}
        width={700}
      >
        {selectedPrescription && (
          <div className="space-y-6">
            {/* Genel Bilgiler */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Reçete Tarihi</p>
                  <p className="font-medium">
                    {moment(selectedPrescription.prescriptionDate).format('DD.MM.YYYY')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doktor</p>
                  <p className="font-medium">{selectedPrescription.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanı</p>
                  <p className="font-medium">{selectedPrescription.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Durum</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPrescription.status)}`}>
                    {getStatusText(selectedPrescription.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* İlaçlar */}
            <div>
              <h3 className="text-lg font-medium mb-4">İlaçlar</h3>
              <div className="space-y-4">
                {selectedPrescription.medications?.map((medication, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{medication.name}</h4>
                        <p className="text-sm text-gray-500">
                          {medication.dosage} - {medication.frequency}
                        </p>
                        <p className="text-sm text-gray-500">
                          {moment(medication.startDate).format('DD.MM.YYYY')} - 
                          {moment(medication.endDate).format('DD.MM.YYYY')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">
                          {calculateUsageProgress(medication)}% Tamamlandı
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <strong>Kullanım:</strong> {medication.instructions}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notlar */}
            {selectedPrescription.notes && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Notlar</h3>
                <p className="text-gray-600">{selectedPrescription.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

PatientPrescriptions.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default PatientPrescriptions;