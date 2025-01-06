import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Input, Card } from 'antd';
import { TbUserEdit } from 'react-icons/tb';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { deletePatient, getAllPatients } from '../../services/patient-service';

const PatientTable = () => {
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
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

  const handleSearch = async (value) => {
    try {
      const response = await getAllPatients(page, size, value);
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
      setSearchText(value);
    } catch (error) {
      console.error('Hasta arama sırasında hata oluştu:', error);
      toast.error('Hasta arama sırasında bir hata oluştu');
    }
  };

  const handleEdit = (record) => {
    navigate(`/dashboard/patient-management/edit/${record.id}`);
  };

  const showDeleteConfirm = (patientId) => {
    setSelectedPatientId(patientId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPatientId) {
      deletePatient(selectedPatientId);
      toast.success('Hasta başarıyla silindi');
      const updatedPatients = patients.filter((pat) => pat.id !== selectedPatientId);
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);
      setIsDeleteModalVisible(false);
    }
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

          <Button
            type="default"
            size="small"
            danger
            className="text-red-500 hover:text-yellow-400 hover:border-red-600"
            onClick={() => showDeleteConfirm(record.id)}
          >
            Sil
          </Button>
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
                  onClick={() => showDeleteConfirm(patient.id)}
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

      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '22px' }} />
          <span style={{ color: '#faad14', fontSize: '18px' }}>Hastayı Sil</span>
        </div>}
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Sil"
        cancelText="Vazgeç"
        centered
        width={500}
        okButtonProps={{ 
          danger: true,
          style: { 
            backgroundColor: '#ff4d4f', 
            borderColor: '#ff4d4f',
            transition: 'all 0.3s'
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.backgroundColor = '#ff1f1f';
            e.currentTarget.style.borderColor = '#ff1f1f';
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = '#ff4d4f';
            e.currentTarget.style.borderColor = '#ff4d4f';
          }
        }}
        cancelButtonProps={{
          style: { marginRight: '8px' }
        }}
      >
        <div style={{ fontSize: '16px', marginTop: '16px' }}>
          <p>Bu hastayı silmek istediğinizden emin misiniz?</p>
          <p style={{ color: '#8c8c8c', marginTop: '8px' }}>Not: Silinen hasta kaydı sistem tarafından kalıcı olarak silinecektir ve geri alınamaz.</p>
        </div>
      </Modal>
    </div>
  );
};

export default PatientTable; 