import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Input, Button, Pagination } from 'antd';
import { 
  UserOutlined, 
  MedicineBoxOutlined, 
  MailOutlined, 
  PhoneOutlined,
  GlobalOutlined, 
  SearchOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAllDoctors } from '../../services/doctor-service';
import { useWindowSize } from 'react-use'; // Ekran boyutunu takip etmek için
import { useMediaQuery } from 'react-responsive';

const AdminMainDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialityCounts, setSpecialityCounts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { width } = useWindowSize();

  const isMobileView = useMediaQuery({ maxWidth: 730 });

  // Sayfalama için durum yönetimi
  const [currentSpecialityPage, setCurrentSpecialityPage] = useState(1);
  const [currentDoctorPage, setCurrentDoctorPage] = useState(1);
  const pageSize = 5; // Her sayfada gösterilecek kart sayısı

  // Ekran genişliğine göre col span değerlerini belirle
  const getResponsiveSpan = () => {
    if (width < 576) return 24;        // xs screens
    if (width < 768) return 12;        // sm screens
    if (width < 992) return 8;         // md screens
    return 6;                          // lg and larger screens
  };

  // Ekran genişliğine göre grafik yüksekliğini belirle
  const getChartHeight = () => {
    if (width < 576) return 200;       // xs screens
    return 300;                        // larger screens
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const fetchedDoctors = await getAllDoctors();
        setDoctors(fetchedDoctors);

        const specialityMap = fetchedDoctors.reduce((acc, doctor) => {
          acc[doctor.speciality] = (acc[doctor.speciality] || 0) + 1;
          return acc;
        }, {});
        const specialityData = Object.entries(specialityMap).map(([name, value]) => ({
          name,
          value
        }));

        setSpecialityCounts(specialityData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'ad',
      key: 'name',
      render: (text, record) => `${record.ad} ${record.soyad}`,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="İsim Ara"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Ara
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Temizle
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        `${record.ad} ${record.soyad}`.toLowerCase().includes(value.toLowerCase().trim()),
    },
    {
      title: 'Speciality',
      dataIndex: 'speciality',
      key: 'speciality',
      render: (speciality) => <Tag color="blue">{speciality}</Tag>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Uzmanlık Ara"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Ara
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Temizle
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.speciality.toLowerCase().includes(value.toLowerCase().trim()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <span>
          <MailOutlined /> {email}
        </span>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <span>
          <PhoneOutlined /> {phone}
        </span>
      ),
      responsive: ['lg']  // Sadece large ve daha büyük ekranlarda göster
    }
  ];

  // specialityColumns tanımlaması
  const specialityColumns = [
    {
      title: 'Uzmanlık Adı',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Doktor Sayısı',
      dataIndex: 'value',
      key: 'value',
    }
  ];

  // Genel arama için filtreleme
  const filteredDoctors = doctors.filter(doctor => {
    const searchTerm = searchText.toLowerCase().trim();
    const fullName = `${doctor.ad} ${doctor.soyad}`.toLowerCase();
    const speciality = doctor.speciality.toLowerCase();

    if (!searchTerm) return true; // Arama terimi boşsa tüm kayıtları göster
    return fullName.includes(searchTerm) || speciality.includes(searchTerm);
  });

  // Sayfalama için verileri dilimle
  const paginatedSpecialityCounts = specialityCounts.slice(
    (currentSpecialityPage - 1) * pageSize,
    currentSpecialityPage * pageSize
  );

  const paginatedDoctors = filteredDoctors.slice(
    (currentDoctorPage - 1) * pageSize,
    currentDoctorPage * pageSize
  );

  return (
    <div className="p-4 lg:p-6 bg-gray-50">
      <Row gutter={[{ xs: 8, sm: 16 }, { xs: 8, sm: 16 }]}>
        {/* Overview Statistics */}
        <Col span={24}>
          <Row gutter={[{ xs: 8, sm: 16 }, { xs: 8, sm: 16 }]}>
            <Col span={getResponsiveSpan()}>
              <Card>
                <Statistic 
                  title="Toplam doktor" 
                  value={doctors.length} 
                  prefix={<UserOutlined />} 
                />
              </Card>
            </Col>
            <Col span={getResponsiveSpan()}>
              <Card>
                <Statistic 
                  key={specialityCounts.length} 
                  title="Toplam Uzmanlık" 
                  value={specialityCounts.length} 
                  prefix={<MedicineBoxOutlined />} 
                />
                
              </Card>
            </Col>
            <Col span={getResponsiveSpan()}>
              <Card>
                <Statistic 
                key={specialityCounts.length} 
                  title="Uzmanlık Çeşitliliği" 
                  value={`${((specialityCounts.length / doctors.length) * 100).toFixed(1)}%`} 
                  prefix={<GlobalOutlined />} 
                />
                
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Specialty Distribution Charts */}
        <Col xs={24} lg={24}>
          <Card title="Uzmanlık Dağılımı">
            <ResponsiveContainer width="100%" height={getChartHeight()}>
              <BarChart data={specialityCounts} >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: width < 576 ? 10 : 12 }} // Küçük ekranlarda font boyutunu küçült
                  angle={width < 576 ? -45 : 0} // Küçük ekranlarda yazıları aç
                  textAnchor="end"
                  display={width < 1900 ? "none" : "auto"}
                  
                  />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Uzmanlıklar" fill="#87e983" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Uzmanlıklar Tablosu veya Kartları */}
        <Col span={24}>
          {isMobileView ? (
            <>
              {paginatedSpecialityCounts.map((speciality) => (
                <Card key={speciality.name} style={{ marginBottom: 16 }}>
                  <p><strong>Uzmanlık Adı:</strong> {speciality.name}</p>
                  <p><strong>Doktor Sayısı:</strong> {speciality.value}</p>
                </Card>
              ))}
              <Pagination
                current={currentSpecialityPage}
                pageSize={pageSize}
                total={specialityCounts.length}
                onChange={(page) => setCurrentSpecialityPage(page)}
                style={{ textAlign: 'center', marginTop: 16 }}
              />
            </>
          ) : (
            <Table
              style={{ marginTop: 16 }}
              dataSource={specialityCounts}
              columns={specialityColumns}
              rowKey={(record) => record.name}
              pagination={{
                pageSize: 10,
                simple: false,
              }}
              scroll={{ x: true }}
            />
          )}
        </Col>

        {/* Doctor List veya Kartları */}
        <Col span={24}>
          <Card title="Doctor Details">
            <Input
              placeholder="Doktor Ara..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <div className="overflow-x-auto">
              {isMobileView ? (
                <>
                  {paginatedDoctors.map((doctor) => (
                    <Card key={doctor.id} style={{ marginBottom: 16 }}>
                      <p><strong>Ad:</strong> {doctor.ad} {doctor.soyad}</p>
                      <p><strong>Uzmanlık:</strong> {doctor.speciality}</p>
                      <p><strong>Email:</strong> {doctor.email}</p>
                      <p><strong>Telefon:</strong> {doctor.phone}</p>
                    </Card>
                  ))}
                  <Pagination
                    current={currentDoctorPage}
                    pageSize={pageSize}
                    total={filteredDoctors.length}
                    onChange={(page) => setCurrentDoctorPage(page)}
                    style={{ textAlign: 'center', marginTop: 16 }}
                  />
                </>
              ) : (
                <Table
                  columns={tableColumns}
                  dataSource={filteredDoctors}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    simple: false,
                  }}
                  scroll={{ x: true }}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminMainDashboard;
