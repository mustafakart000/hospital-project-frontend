import React, { useState, useEffect } from 'react';
import { Table, Card, Avatar, Pagination } from 'antd';
import { User, Calendar, Clock, ArrowUpCircle } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import { getTodayTreatedPatients } from '../../services/reservation-service';

const DoctorPatients = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 745 });
  const pageSize = 10;

  useEffect(() => {
    const fetchTreatedPatients = async () => {
      setLoading(true);
      try {
        const response = await getTodayTreatedPatients();
        setPatients(response);
      } catch (error) {
        console.error('Bugün tedavi edilmiş hastalar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatedPatients();
  }, []);

  const paginatedData = patients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: 'Hasta',
      key: 'patient',
      render: (record) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<User className="w-4 h-4" />} className="bg-blue-100 text-blue-600" />
          <div>
            <div className="font-medium">{record.patientName} {record.patientSurname}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Randevu Tarihi',
      key: 'reservationDate',
      render: (record) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{record.reservationDate}</span>
        </div>
      ),
    },
    {
      title: 'Doktor',
      key: 'doctor',
      render: (record) => (
        <div className="space-y-1">
          <div className="font-medium">{record.doctorName} {record.doctorSurname}</div>
          <div className="text-sm text-gray-500">{record.speciality}</div>
        </div>
      ),
    },
    {
      title: 'Tedavi Durumu',
      key: 'treated',
      render: (record) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{record.treated ? 'Tedavi Edildi' : 'Tedavi Edilmedi'}</span>
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex justify-between items-center'}`}>
        <div className="flex items-center space-x-3">
          <ArrowUpCircle className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bugün Tedavi Edilmiş Hastalar</h3>
            <p className="text-sm text-gray-500">Bugün tedavi edilen hasta listesi ve detayları</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
            <div className="text-sm text-gray-500">Toplam Hasta</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(patient => patient.treated).length}
            </div>
            <div className="text-sm text-gray-500">Tedavi Edilmiş</div>
          </div>
        </Card>
        <Card className={`bg-white shadow-sm ${isMobile ? 'col-span-2' : ''}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {patients.filter(patient => patient.status === 'CONFIRMED').length}
            </div>
            <div className="text-sm text-gray-500">Onaylanmış Randevu</div>
          </div>
        </Card>
        {!isMobile && (
          <Card className="bg-white shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {patients.filter(patient => patient.status === 'CANCELLED').length}
              </div>
              <div className="text-sm text-gray-500">İptal Edilmiş</div>
            </div>
          </Card>
        )}
      </div>

      {/* Patients List */}
      {isMobile ? (
        <div className="space-y-4">
          {paginatedData.map((patient) => (
            <Card key={patient.id} className="bg-white shadow-sm">
              <div className="space-y-4">
                {/* Hasta Başlığı */}
                <div className="flex items-center space-x-3">
                  <Avatar icon={<User className="w-4 h-4" />} className="bg-blue-100 text-blue-600" />
                  <div>
                    <div className="font-medium">{patient.patientName} {patient.patientSurname}</div>
                  </div>
                </div>

                {/* Randevu Bilgileri */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{patient.reservationDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{patient.doctorName} {patient.doctorSurname}</span>
                  </div>
                  <div className="text-sm text-gray-500">{patient.speciality}</div>
                </div>

                {/* Alt Bilgiler */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Tedavi: {patient.treated ? 'Evet' : 'Hayır'}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Mobile Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={patients.length}
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
          dataSource={patients}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            total: patients.length,
            pageSize: pageSize,
            onChange: setCurrentPage,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} hasta`
          }}
          className="bg-white shadow-sm rounded-lg"
        />
      )}
    </div>
  );
};

export default DoctorPatients;