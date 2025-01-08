import React, { useState, useEffect } from 'react';
import { Table, Button, Input, DatePicker, Select, Card } from 'antd';
import { FileText, Search, Calendar } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import PrescriptionForm from './prescription-form';
import { getPrescriptionByPatientId } from '../../services/prescription-service';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DoctorPrescriptions = () => {
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 660 });
  const isTablet = useMediaQuery({ maxWidth: 1024 });
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await getPrescriptionByPatientId(25);
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
      render: (medications, record) => (
        <div className="space-y-2">
          {medications.map((med) => (
            <div key={med.id} className="text-sm">
              <span className="font-medium">{med.name}</span>
              <span className="text-gray-500"> - {med.dosage} ({med.frequency})</span>
              <div className="text-xs text-gray-500">
                Kullanım: {med.usage}, Süre: {med.duration} gün
              </div>
            </div>
          ))}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Notlar: </span>
            {record.notes}
          </div>
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

  const paginatedData = prescriptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 p-4">
      <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex justify-between items-center'}`}>
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
          onClick={() => setShowForm(true)}
        >
          Yeni Reçete Oluştur
        </Button>
      </div>

      {showForm && <PrescriptionForm onClose={() => setShowForm(false)} />}

      <Card className="bg-white shadow-sm">
        <div className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
          <Input
            placeholder="Hasta Ara"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
          />
          <RangePicker 
            className="w-full" 
            placeholder={['Başlangıç', 'Bitiş']} 
          />
          <Select defaultValue="" className="w-full" placeholder="Durum">
            <Option value="">Tümü</Option>
            <Option value="active">Aktif</Option>
            <Option value="expired">Süresi Dolmuş</Option>
          </Select>
        </div>
      </Card>

      {isMobile ? (
        <div className="space-y-4">
          {paginatedData.map((prescription) => (
            <Card key={prescription.id} className="bg-white shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">Reçete No: {prescription.id.slice(0, 8)}...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{dayjs(prescription.createdAt).format('DD/MM/YYYY')}</span>
                </div>
                <div className="space-y-2">
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
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Notlar: </span>
                  {prescription.notes}
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
            current: currentPage,
            total: prescriptions.length,
            pageSize: pageSize,
            onChange: (page) => setCurrentPage(page),
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