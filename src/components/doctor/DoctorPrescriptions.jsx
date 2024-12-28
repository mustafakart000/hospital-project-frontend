import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, DatePicker, Select, Card } from 'antd';
import { FileText, Search, Calendar, User, Activity } from 'lucide-react';
import PrescriptionForm from './prescription-form';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DoctorPrescriptions = () => {
  const [loading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 610);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 610);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample data - replace with actual API data
  const prescriptions = [
    {
      id: 1,
      patientName: 'Ahmet Yılmaz',
      date: '2024-12-19',
      diagnosis: 'Grip',
      medications: [
        { name: 'Parol', dosage: '500mg', frequency: '2x1' },
        { name: 'Sudafed', dosage: '30mg', frequency: '1x1' }
      ],
      status: 'active',
      insuranceType: 'SGK'
    },
    {
      id: 2,
      patientName: 'Ayşe Demir',
      date: '2024-12-18',
      diagnosis: 'Alerji',
      medications: [
        { name: 'Allegra', dosage: '180mg', frequency: '1x1' }
      ],
      status: 'expired',
      insuranceType: 'Özel'
    },
    // Add more sample data as needed
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Aktif',
      expired: 'Süresi Dolmuş',
      pending: 'Beklemede'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Hasta',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Tanı',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'İlaçlar',
      dataIndex: 'medications',
      key: 'medications',
      render: (medications) => (
        <div className="space-y-1">
          {medications.map((med, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium">{med.name}</span>
              <span className="text-gray-500"> - {med.dosage} ({med.frequency})</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Sigorta',
      dataIndex: 'insuranceType',
      key: 'insuranceType',
      render: (text) => (
        <Tag className="rounded-full px-2 py-1 text-xs">
          {text}
        </Tag>
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
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reçeteler</h3>
            <p className="text-sm text-gray-500">Tüm reçeteleri görüntüle ve yönet</p>
          </div>
        </div>
        <Button 
          type="primary"
          className="bg-blue-600"
          onClick={() => {
            <PrescriptionForm />
          }}
        >
          Yeni Reçete Oluştur
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Hasta Ara"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
          />
          <RangePicker className="w-full" placeholder={['Başlangıç', 'Bitiş']} />
          <Select defaultValue="" className="w-full" placeholder="Sigorta Türü">
            <Option value="">Tümü</Option>
            <Option value="SGK">SGK</Option>
            <Option value="Özel">Özel Sigorta</Option>
          </Select>
          <Select defaultValue="" className="w-full" placeholder="Durum">
            <Option value="">Tümü</Option>
            <Option value="active">Aktif</Option>
            <Option value="expired">Süresi Dolmuş</Option>
            <Option value="pending">Beklemede</Option>
          </Select>
        </div>
      </Card>

      {/* Table or Card View */}
      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="bg-white shadow-sm">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{prescription.patientName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{prescription.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span>{prescription.diagnosis}</span>
                </div>
                <div className="space-y-1">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{med.name}</span>
                      <span className="text-gray-500"> - {med.dosage} ({med.frequency})</span>
                    </div>
                  ))}
                </div>
                <Tag className="rounded-full px-2 py-1 text-xs">
                  {prescription.insuranceType}
                </Tag>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                  {getStatusText(prescription.status)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={prescriptions}
          loading={loading}
          rowKey="id"
          pagination={{
            total: prescriptions.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} reçete`
          }}
          className="bg-white shadow-sm rounded-lg"
        />
      )}
    </div>
  );
};

export default DoctorPrescriptions;