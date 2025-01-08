import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Input, List, Card } from "antd";
import { TbUserEdit } from "react-icons/tb";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { deleteDoctor, getAllDoctors } from "../../services/doctor-service";
import PropTypes from "prop-types";
import { useMediaQuery } from 'react-responsive';

const DoctorTable = ({ activeTab }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 580 });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();
        const formattedDoctors = response.map((doctor) => {
          const { ad, soyad, phone, speciality, id } = doctor;
          return {
            name: `${ad} ${soyad}`,
            phone,
            speciality,
            id: id,
          };
        });
        setDoctors(formattedDoctors);
        setFilteredDoctors(formattedDoctors);
      } catch (error) {
        console.error("Doktorları çekerken hata oluştu:", error);
      }
    };

    fetchDoctors();
  }, [activeTab==="list"]);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = doctors.filter((doctor) =>
      Object.values(doctor).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchValue)
      )
    );
    setFilteredDoctors(filtered);
    setSearchText(value);
  };

  const handleEdit = (record) => {
    navigate(`/dashboard/doctor-management/edit/${record.id}`);
  };

  const showDeleteConfirm = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDoctorId) {
      deleteDoctor(selectedDoctorId);
      toast.success("Doktor başarıyla silindi");
      const updatedDoctors = doctors.filter((doc) => doc.id !== selectedDoctorId);
      setDoctors(updatedDoctors);
      setFilteredDoctors(updatedDoctors);
      setIsDeleteModalVisible(false);
    }
  };

  const getSpecialties = () => {
    const specialties = [...new Set(doctors.map(doctor => doctor.speciality))];
    return specialties.map(specialty => ({
      text: specialty,
      value: specialty,
    }));
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
      filters: doctors.map(doctor => ({
        text: doctor.name,
        value: doctor.id,
      })),
      onFilter: (value, record) => record.id === value,
    },
    {
      title: "Uzmanlık",
      dataIndex: "speciality",
      key: "specialty",
      width: 150,
      responsive: ["sm", "md", "lg"],
      filters: getSpecialties(),
      onFilter: (value, record) => record.speciality === value,
      sorter: (a, b) => a.speciality.localeCompare(b.speciality),
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      responsive: ["md", "lg"],
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
        placeholder="Doktor ara..."
        allowClear
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 200 }}
      />
      {!isMobile ? (
        <Table
          columns={columns}
          dataSource={filteredDoctors}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredDoctors}
          pagination={{
            onChange: () => {
              window.scrollTo(0, 0);
            },
            pageSize: 10,
            total: filteredDoctors.length,
            showTotal: (total) => `Toplam ${total} kayıt`,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          renderItem={(doctor) => (
            <List.Item>
              <Card>
                <div className="flex flex-col gap-2">
                  <div className="font-medium text-lg">{doctor.name}</div>
                  <div>
                    <span className="text-gray-500">Uzmanlık:</span> {doctor.speciality}
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span> {doctor.phone}
                  </div>
                  <Space size="small" className="mt-2">
                    <Button
                      type="default"
                      size="small"
                      className="text-emerald-500 hover:text-yellow-400 hover:border-emerald-600"
                      onClick={() => handleEdit(doctor)}
                    >
                      <TbUserEdit />
                    </Button>
                    <Button
                      type="default"
                      size="small"
                      danger
                      className="text-red-500 hover:text-yellow-400 hover:border-red-600"
                      onClick={() => showDeleteConfirm(doctor.id)}
                    >
                      Sil
                    </Button>
                  </Space>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '22px' }} />
          <span style={{ color: '#faad14', fontSize: '18px' }}>Doktoru Sil</span>
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
          <p>Bu doktoru silmek istediğinizden emin misiniz?</p>
          <p style={{ color: '#8c8c8c', marginTop: '8px' }}>Not: Silinen doktor kaydı sistem tarafından kalıcı olarak silinecektir ve geri alınamaz.</p>
        </div>
      </Modal>
    </div>
  );
};

DoctorTable.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default DoctorTable;