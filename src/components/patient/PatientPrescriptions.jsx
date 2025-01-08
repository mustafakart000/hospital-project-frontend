import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Input, Select, Pagination } from 'antd';
import { Calendar, Search, Filter } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getPrescriptionsCurrentPatient } from '../../services/prescription-service';
import { getDoctorById } from '../../services/doctor-service';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const isMobile = useMediaQuery({ maxWidth: 768 });
  
  const patientId = useSelector(state => state.auth.user.id.toString());

  const calculatePrescriptionStatus = (prescription) => {
    const now = moment();
    const allMedicationsExpired = prescription.medications?.every(med => 
      moment(med.endDate).isBefore(now)
    );
    
    if (allMedicationsExpired) {
      return 'EXPIRED';
    }
    
    const allMedicationsCompleted = prescription.medications?.every(med => 
      moment(med.endDate).isBefore(now)
    );
    
    if (allMedicationsCompleted) {
      return 'COMPLETED';
    }
    
    return 'ACTIVE';
  };

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await getPrescriptionsCurrentPatient();
      console.log("data",data)
      const prescriptionData = Array.isArray(data) ? data : [];
      
      // Doktor bilgilerini getir
      const prescriptionsWithDoctorInfo = await Promise.all(
        prescriptionData.map(async (prescription) => {
          try {
            const doctorInfo = await getDoctorById(prescription.doctorId);
            console.log("doctorInfo",doctorInfo)
            return {
              ...prescription,
              status: calculatePrescriptionStatus(prescription),
              doctorName: `${doctorInfo.unvan} ${doctorInfo.ad} ${doctorInfo.soyad}`,
              diagnosis: prescription.diagnosis || 'Tanı Girilmemiş',
              prescriptionDate: prescription.createdAt,
            };
          } catch (error) {
            console.error(`Doktor bilgileri alınamadı (ID: ${prescription.doctorId}):`, error);
            return {
              ...prescription,
              status: calculatePrescriptionStatus(prescription),
              doctorName: 'Dr.',
              diagnosis: prescription.diagnosis || 'Tanı Girilmemiş',
              prescriptionDate: prescription.createdAt,
            };
          }
        })
      );
      
      setPrescriptions(prescriptionsWithDoctorInfo);
    } catch (error) {
      console.error('Reçeteler yüklenirken hata oluştu:', error);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const getFilteredPrescriptions = () => {
    return prescriptions.filter(prescription => {
      const matchesSearch = 
        prescription.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
        prescription.diagnosis.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
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
      dataIndex: 'notes',
      key: 'notes',
      render: (text) => (
        <Tag className="rounded-full">{text || 'Not Girilmemiş'}</Tag>
      ),
    },
    {
      title: 'İlaç Adı',
      key: 'medicationName',
      render: (record) => (
        <div>
          {record.medications?.map((med, index) => (
            <Tag key={index} className="m-1">
              {med.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Dosage',
      key: 'medicationDosage',
      render: (record) => (
        <div>
          {record.medications?.map((med, index) => (
            <Tag key={index} className="m-1">
              {med.dosage}
            </Tag>
          ))}
        </div>
      ),
    }
  ];

  // İstatistik kartları için veriler
  const stats = {
    active: prescriptions?.filter(p => p.status === 'ACTIVE')?.length || 0,
    completed: prescriptions?.filter(p => p.status === 'COMPLETED')?.length || 0,
    expired: prescriptions?.filter(p => p.status === 'EXPIRED')?.length || 0,
  };

  // Pagination için veri hesaplama
  const paginatedData = getFilteredPrescriptions().slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {!isMobile && (
        <>
          {/* İstatistikler */}
          <div className="grid grid-cols-3 gap-6">
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
        </>
      )}

      {/* Filtreler */}
      <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex items-center'} gap-4`}>
        <Input
          placeholder="Doktor veya Tanı Ara"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className={`${isMobile ? 'w-full' : 'flex-1'}`}
        />
        <Select
          placeholder="Durum Filtrele"
          value={filterStatus}
          onChange={setFilterStatus}
          className={`${isMobile ? 'w-full' : 'w-48'}`}
          suffixIcon={<Filter className="w-4 h-4" />}
        >
          <Select.Option value="all">Tümü</Select.Option>
          <Select.Option value="ACTIVE">Aktif</Select.Option>
          <Select.Option value="COMPLETED">Tamamlanan</Select.Option>
          <Select.Option value="EXPIRED">Süresi Dolmuş</Select.Option>
        </Select>
      </div>

      {/* Reçete Listesi */}
      {isMobile ? (
        <div className="space-y-4">
          {paginatedData.map(prescription => (
            <Card key={prescription.id} className="bg-white shadow-sm p-2">
              <div className="space-y-3">
                {/* Tarih */}
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span>{moment(prescription.prescriptionDate).format('DD.MM.YYYY')}</span>
                </div>

                {/* Doktor Bilgileri */}
                <div className="space-y-1">
                  <div className="font-medium text-sm">{prescription.doctorName}</div>
                  <div className="text-xs text-gray-500">{prescription.department}</div>
                </div>

                {/* Tanı */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">Tanı:</div>
                  <Tag className="rounded-full text-xs">{prescription.notes || 'Not Girilmemiş'}</Tag>
                </div>

                {/* İlaçlar */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">İlaçlar:</div>
                  <div className="flex flex-wrap gap-2">
                    {prescription.medications?.map((med, index) => (
                      <div key={index} className="flex flex-wrap gap-1">
                        <Tag className="text-xs m-0">{med.name}</Tag>
                        <Tag className="text-xs m-0">{med.dosage}</Tag>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Mobil Pagination */}
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              total={getFilteredPrescriptions().length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              size="small"
              showSizeChanger={false}
              showTotal={(total) => (
                <span className="text-xs text-gray-500">
                  Toplam {total} reçete
                </span>
              )}
            />
          </div>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={getFilteredPrescriptions()}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            total: getFilteredPrescriptions().length,
            pageSize: pageSize,
            onChange: setCurrentPage,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} reçete`,
          }}
          className="bg-white shadow-sm rounded-lg"
        />
      )}
    </div>
  );
};

PatientPrescriptions.propTypes = {
  patientId: PropTypes.string,
};

export default PatientPrescriptions;