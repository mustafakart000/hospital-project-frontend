import React, { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Input } from "antd";
import { TbUserEdit } from "react-icons/tb";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { deleteAdmin, getAllAdmins } from "../../services/admin-service";

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [searchText, setSearchText] = useState('');  // Arama metni için state
    const [filteredAdmins, setFilteredAdmins] = useState([]); // Filtrelenmiş doktorlar için state
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
        setFilteredAdmins(formattedAdmins); // Başlangıçta tüm doktorları filtered state'e de ata
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

  const handleDelete = (key) => {
    deleteAdmin(key);
    toast.success("Admin başarıyla silindi");
    const updatedAdmins = admins.filter((admin) => admin.id !== key);
    setAdmins(updatedAdmins);
    setFilteredAdmins(updatedAdmins); // Filtrelenmiş listeyi de güncelle
  };

  // Uzmanlık alanları için benzersiz değerleri al
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
        value: admin.id, // id'yi value olarak kullan
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

          <Popconfirm
            title="Bu admini silmek istediğinizden emin misiniz?"
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
      <Table
        columns={columns}
        dataSource={filteredAdmins}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default AdminTable;