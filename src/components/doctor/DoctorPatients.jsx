import React, { useState } from 'react';
import { Table, Card, Input, Button, Tag, Avatar, Select, Pagination } from 'antd';
import { Search, User, Calendar, Phone, Mail, Clock, ArrowUpCircle } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

const { Option } = Select;

const DoctorPatients = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery({ maxWidth: 745 });
  const pageSize = 10;

  // Sample data - replace with actual API data
  const patients = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      age: 45,
      gender: 'Erkek',
      phone: '0532 XXX XX XX',
      email: 'ahmet@example.com',
      lastVisit: '2024-12-15',
      status: 'active',
      conditions: ['Hipertansiyon', 'Diyabet'],
      visits: 8
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      age: 32,
      gender: 'Kadın',
      phone: '0533 XXX XX XX',
      email: 'ayse@example.com',
      lastVisit: '2024-12-10',
      status: 'scheduled',
      conditions: ['Alerji'],
      visits: 3
    },
    // Add more sample data
  ];

  const paginatedData = patients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Aktif',
      scheduled: 'Randevulu',
      inactive: 'İnaktif'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Hasta',
      key: 'patient',
      render: (record) => (
        <div className="flex items-center space-x-3">
          <Avatar icon={<User className="w-4 h-4" />} className="bg-blue-100 text-blue-600" />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">
              {record.age} yaş, {record.gender}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'İletişim',
      key: 'contact',
      render: (record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{record.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Son Ziyaret',
      key: 'lastVisit',
      render: (record) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{record.lastVisit}</span>
        </div>
      ),
    },
    {
      title: 'Durumlar',
      key: 'conditions',
      render: (record) => (
        <div className="flex flex-wrap gap-1">
          {record.conditions.map((condition) => (
            <Tag key={condition} className="rounded-full">
              {condition}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Ziyaretler',
      dataIndex: 'visits',
      key: 'visits',
      render: (visits) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{visits} ziyaret</span>
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
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex justify-between items-center'}`}>
        <div className="flex items-center space-x-3">
          <ArrowUpCircle className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Hastalar</h3>
            <p className="text-sm text-gray-500">Hasta listesi ve detaylar</p>
          </div>
        </div>
        <Button 
          type="primary"
          className="bg-blue-600"
          icon={<User className="w-4 h-4" />}
        >
          Yeni Hasta Ekle
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-4'}`}>
          <Input
            placeholder="Hasta Ara (Ad, Email, Telefon)"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
          />
          <Select defaultValue="" className="w-full" placeholder="Durum">
            <Option value="">Tümü</Option>
            <Option value="active">Aktif</Option>
            <Option value="scheduled">Randevulu</Option>
            <Option value="inactive">İnaktif</Option>
          </Select>
          <Select defaultValue="" className="w-full" placeholder="Sıralama">
            <Option value="recent">Son Ziyaret</Option>
            <Option value="visits">Ziyaret Sayısı</Option>
            <Option value="name">İsim</Option>
          </Select>
        </div>
      </Card>

      {/* Statistics */}
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">156</div>
            <div className="text-sm text-gray-500">Toplam Hasta</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-sm text-gray-500">Aktif Hasta</div>
          </div>
        </Card>
        <Card className={`bg-white shadow-sm ${isMobile ? 'col-span-2' : ''}`}>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <div className="text-sm text-gray-500">Bugünkü Randevu</div>
          </div>
        </Card>
        {!isMobile && (
          <Card className="bg-white shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-gray-500">Memnuniyet Oranı</div>
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
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-500">
                      {patient.age} yaş, {patient.gender}
                    </div>
                  </div>
                </div>

                {/* İletişim Bilgileri */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{patient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{patient.lastVisit}</span>
                  </div>
                </div>

                {/* Durumlar */}
                <div className="flex flex-wrap gap-2">
                  {patient.conditions.map((condition) => (
                    <Tag key={condition} className="rounded-full">
                      {condition}
                    </Tag>
                  ))}
                </div>

                {/* Alt Bilgiler */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{patient.visits} ziyaret</span>
                  </div>
                  <Tag color={patient.status === 'active' ? 'success' : 'default'}>
                    {patient.status === 'active' ? 'Aktif' : 'İnaktif'}
                  </Tag>
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