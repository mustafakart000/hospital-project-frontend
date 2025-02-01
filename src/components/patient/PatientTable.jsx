import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Input, Card } from 'antd';
import { TbUserEdit } from 'react-icons/tb';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { deletePatient, getAllPatients } from '../../services/patient-service';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';

const PatientTable = ({ activeTab }) => {
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 610 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getAllPatients();
        console.log("response",response)
        const formattedPatients = response.content.map((patient) => {
          const { ad, soyad, telefon, id, tcKimlik } = patient;
          return {
            name: `${ad} ${soyad}`,
            phone: telefon,
            tcKimlik,
            id: id,
          };
        });
        setPatients(formattedPatients);
        setFilteredPatients(formattedPatients);
      } catch (error) {
        console.error("Hastaları çekerken hata oluştu:", error);
      }
    };

    fetchPatients();
  }, [activeTab==="list"]);

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

  const showDeleteConfirm = (patientId) => {
    setSelectedPatientId(patientId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPatientId) {
      deletePatient(selectedPatientId);
      toast.success("Hasta başarıyla silindi");
      const updatedPatients = patients.filter((patient) => patient.id !== selectedPatientId);
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);
      setIsDeleteModalVisible(false);
    }
  };

  const columns = [
    {
      title: "İsim",
      dataIndex: "name",
      key: "name",
      width: 200,
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterSearch: true,
      filters: patients.map(patient => ({
        text: patient.name,
        value: patient.id,
      })),
      onFilter: (value, record) => record.id === value,
    },
    {
      title: "TC Kimlik",
      dataIndex: "tcKimlik",
      key: "tcKimlik",
      width: 150,
      responsive: isMobile ? [] : ["xs", "sm", "md", "lg"],
      sorter: (a, b) => a.tcKimlik.localeCompare(b.tcKimlik),
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      responsive: isMobile ? [] : ["xs", "sm", "md", "lg"],
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Aksiyonlar",
      key: "action",
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
      responsive: ["xs", "sm", "md", "lg"],
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
        <div className="grid grid-cols-1 gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} size="small" className="shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">{patient.name}</span>
                  <Space size="small">
                    <Button
                      type="default"
                      size="small"
                      className="text-emerald-500 hover:text-yellow-400 hover:border-emerald-600"
                      onClick={() => handleEdit(patient)}
                    >
                      <TbUserEdit />
                    </Button>
                    <Button
                      type="default"
                      size="small"
                      danger
                      className="text-red-500 hover:text-yellow-400 hover:border-red-600"
                      onClick={() => showDeleteConfirm(patient.id)}
                    >
                      Sil
                    </Button>
                  </Space>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">TC Kimlik: </span>
                  {patient.tcKimlik}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Telefon: </span>
                  {patient.phone}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 580 }}
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

PatientTable.propTypes = {
  activeTab: PropTypes.string
};

export default PatientTable; 