import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Input } from "antd";
import { TbUserEdit } from "react-icons/tb";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { deleteAdmin, getAllAdmins } from "../../services/admin-service";

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllAdmins();
        const formattedAdmins = response.map((admin) => {
          const { ad, soyad, phone, speciality, id } = admin;
          return {
            name: `${ad} ${soyad}`,
            phone,
            speciality,
            id: id,
          };
        });
        setAdmins(formattedAdmins);
        setFilteredAdmins(formattedAdmins);
      } catch (error) {
        console.error("Doktorları çekerken hata oluştu:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = admins.filter((admin) =>
      Object.values(admin).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchValue)
      )
    );
    setFilteredAdmins(filtered);
    setSearchText(value);
  };

  const handleEdit = (record) => {
    navigate(`/dashboard/admin-management/edit/${record.id}`);
  };

  const showDeleteConfirm = (adminId) => {
    setSelectedAdminId(adminId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedAdminId) {
      deleteAdmin(selectedAdminId);
      toast.success("Admin başarıyla silindi");
      const updatedAdmins = admins.filter((admin) => admin.id !== selectedAdminId);
      setAdmins(updatedAdmins);
      setFilteredAdmins(updatedAdmins);
      setIsDeleteModalVisible(false);
    }
  };

  const getSpecialties = () => {
    const specialties = [...new Set(admins.map(admin => admin.speciality))];
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
      filters: admins.map(admin => ({
        text: admin.name,
        value: admin.id,
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
        placeholder="Admin ara..."
        allowClear
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 200 }}
      />
      <Table
        columns={columns}
        dataSource={filteredAdmins}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />

      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '22px' }} />
          <span style={{ color: '#faad14', fontSize: '18px' }}>Admini Sil</span>
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
          <p>Bu admini silmek istediğinizden emin misiniz?</p>
          <p style={{ color: '#8c8c8c', marginTop: '8px' }}>Not: Silinen admin kaydı sistem tarafından kalıcı olarak silinecektir ve geri alınamaz.</p>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTable;