import React, { useState, useEffect } from 'react';
import { Table, Input, DatePicker, Select, Card } from 'antd';
import { FileText, Search, Calendar } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import PrescriptionForm from './prescription-form';
import { getPrescriptionsCurrentDoctor } from '../../services/prescription-service';
import { getPatientProfile } from '../../services/patient-service';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

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
  const doctorId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!doctorId) return;
      
      setLoading(true);
      try {
        const prescriptionsData = await getPrescriptionsCurrentDoctor(doctorId);
        console.log("Reçeteler:", prescriptionsData);

        if (!prescriptionsData || prescriptionsData.length === 0) {
          console.log("Reçete bulunamadı");
          setPrescriptions([]);
          return;
        }

        const promises = prescriptionsData.map(async (prescription) => {
          try {
            const patientData = await getPatientProfile(prescription.patientId);
            console.log("Hasta bilgisi:", patientData);
            
            return {
              ...prescription,
              patientName: `${patientData.ad} ${patientData.soyad}`
            };
          } catch (error) {
            console.error(`Hasta bilgisi alınamadı (ID: ${prescription.patientId}):`, error);
            return {
              ...prescription,
              patientName: 'Hasta bilgisi alınamadı'
            };
          }
        });

        const completedPrescriptions = await Promise.all(promises);
        console.log("İşlenmiş reçeteler:", completedPrescriptions);
        setPrescriptions(completedPrescriptions);

      } catch (error) {
        console.error('Reçeteler yüklenirken hata oluştu:', error);
        setPrescriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [doctorId]);

  const columns = [
    {
      title: 'Hasta Adı Soyadı',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => (
        <div className="flex items-center space-x-2">
          <span>{text}</span>
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
        <div className="space-y-2">
          {medications.map((med) => (
            <div key={med.id} className="text-sm">
              <span className="font-medium">{med.name.split('-')[0]}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Dosage',
      dataIndex: 'medications',
      key: 'dosage',
      render: (medications) => (
        <div className="space-y-2">
          {medications.map((med) => (
            <div key={med.id} className="text-sm text-gray-500">
              {med.dosage} ({med.frequency || '1x1'})
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Kullanım',
      dataIndex: 'medications',
      key: 'usage',
      render: (medications) => (
        <div className="space-y-2">
          {medications.map((med) => (
            <div key={med.id} className="text-sm text-gray-500">
              {med.usage || 'Belirtilmemiş'}
            </div>
          ))}
        </div>
      ),
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
                  <span className="font-medium">Hasta: {prescription.patientName}</span>
                </div>
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
                      <span className="font-medium">{med.name.split('-')[0]}</span>
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