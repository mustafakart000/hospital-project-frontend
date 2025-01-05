import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, Input, Card } from 'antd';
import { TbUserEdit } from 'react-icons/tb';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { deletePatient, getAllPatients } from '../../services/patient-service';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 530);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients(page, size);
        const formattedPatients = response.content.map((patient) => {
          const { ad, soyad, telefon, id } = patient;
          return {
            name: `${ad} ${soyad}`,
            phone: telefon,
            id: id,
          };
        });
        setPatients(formattedPatients);
        setFilteredPatients(formattedPatients);
        setTotal(response.totalElements);
      } catch (error) {
        console.error('Hastaları çekerken hata oluştu:', error);
      }
    };

    fetchPatients();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 530);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [page, size]);

  const handlePageChange = (newPage, newSize) => {
    setPage(newPage - 1);
    setSize(newSize);
  };

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = patients.filter((patient) =>
      Object.values(patient).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchValue)
      )
    );
    setFilteredPatients(filtered);
    setSearchText(value);
  };

  const handleEdit = (record) => {
    navigate(`/dashboard/patient-management/edit/${record.id}`);
  };

  const handleDelete = (key) => {
    deletePatient(key);
    toast.success('Hasta başarıyla silindi');
    const updatedPatients = patients.filter((pat) => pat.id !== key);
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
  };

  const columns = [
    {
      title: 'İsim',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      responsive: ['xs', 'sm', 'md', 'lg'],
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      responsive: ['md', 'lg'],
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'Aksiyonlar',
      key: 'action',
      width: 100,
      render: (text, record) => (
        <Space size="small">
          <Button
            type="default"
            size="small"
            className="text-emerald-500 hover:text-yellow-400 hover:border-emerald-600"
            onClick={() => handleEdit(record)}
          >
            <TbUserEdit />
          </Button>

          <Popconfirm
            title="Bu hastayı silmek istediğinizden emin misiniz?"
            description="Silme işlemini tamamlamak için onaylayın."
            okText="Sil"
            cancelText="Vazgeç"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="default"
              size="small"
              danger
              className="text-red-500 hover:text-yellow-400 hover:border-red-600"
            >
              Sil
            </Button>
          </Popconfirm>
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Hasta ara..."
        allowClear
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 200 }}
      />
      {isMobile ? (
        <div>
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              style={{
                marginBottom: 16,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                padding: '16px',
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <p className="text-lg font-medium"><strong>İsim:</strong> {patient.name}</p>
                <p className="text-lg font-medium"><strong>Telefon:</strong> {patient.phone}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button type="primary" onClick={() => handleEdit(patient)}>Düzenle</Button>
                <Button
                  className="bg-red-500 hover:bg-red-700 text-white"
                  onClick={() => handleDelete(patient.id)}
                >
                  Sil
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey={(record) => record.id}
          pagination={{
            current: page + 1,
            pageSize: size,
            total: total,
            onChange: handlePageChange,
          }}
          scroll={{ x: true }}
        />
      )}
    </div>
  );
};

export default PatientTable; 