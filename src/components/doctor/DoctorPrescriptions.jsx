import React, { useState, useEffect } from 'react';
import { Table, Button, Input, DatePicker, Select, Card } from 'antd';
import { FileText, Search, Calendar, Activity } from 'lucide-react';
import PrescriptionForm from './prescription-form';
import { getPrescriptionByPatientId } from '../../services/prescription-service';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DoctorPrescriptions = () => {
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 610);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 610);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await getPrescriptionByPatientId(25); // örnek hasta ID'si
        setPrescriptions(data);
      } catch (error) {
        console.error('Reçeteler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const columns = [
    {
      title: 'Reçete No',
      dataIndex: 'id',
      key: 'id',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{text.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      title: 'Tarih',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{dayjs(text).format('DD/MM/YYYY')}</span>
        </div>
      ),
    },
    {
      title: 'İlaçlar',
      dataIndex: 'medications',
      key: 'medications',
      render: (medications) => (
        <div className="space-y-1">
          {medications.map((med) => (
            <div key={med.id} className="text-sm">
              <span className="font-medium">{med.name}</span>
              <span className="text-gray-500"> - {med.dosage} ({med.frequency})</span>
              <div className="text-xs text-gray-500">
                Kullanım: {med.usage}, Süre: {med.duration} gün
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Notlar',
      dataIndex: 'notes',
      key: 'notes',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-gray-400" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Durum',
      key: 'status',
      render: (_, record) => {
        const isActive = dayjs().isBefore(dayjs(record.medications[0].endDate));
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Aktif' : 'Süresi Dolmuş'}
          </span>
        );
      },
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
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Reçete No: {prescription.id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{dayjs(prescription.createdAt).format('DD/MM/YYYY')}</span>
                </div>
                <div className="space-y-1">
                  {prescription.medications.map((med) => (
                    <div key={med.id} className="text-sm">
                      <span className="font-medium">{med.name}</span>
                      <span className="text-gray-500"> - {med.dosage} ({med.frequency})</span>
                      <div className="text-xs text-gray-500">
                        Kullanım: {med.usage}, Süre: {med.duration} gün
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span>{prescription.notes}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  dayjs().isBefore(dayjs(prescription.medications[0].endDate))
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {dayjs().isBefore(dayjs(prescription.medications[0].endDate)) ? 'Aktif' : 'Süresi Dolmuş'}
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