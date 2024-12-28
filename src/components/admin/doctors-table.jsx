import React, { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Input } from "antd";
import { TbUserEdit } from "react-icons/tb";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { deleteDoctor, getAllDoctors } from "../../services/doctor-service";
import PropTypes from "prop-types";

  const DoctorTable = ({ activeTab }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState('');  // Arama metni için state
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Filtrelenmiş doktorlar için state
  const navigate = useNavigate();

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
        setFilteredDoctors(formattedDoctors); // Başlangıçta tüm doktorları filtered state'e de ata
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

  const handleDelete = (key) => {
    deleteDoctor(key);
    toast.success("Doktor başarıyla silindi");
    const updatedDoctors = doctors.filter((doc) => doc.id !== key);
    setDoctors(updatedDoctors);
    setFilteredDoctors(updatedDoctors); // Filtrelenmiş listeyi de güncelle
  };

  // Uzmanlık alanları için benzersiz değerleri al
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
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterSearch: true,
      filters: doctors.map(doctor => ({
        text: doctor.name,
        value: doctor.id, // id'yi value olarak kullan
      })),
      onFilter: (value, record) => record.id === value,
    },
    {
      title: "Uzmanlık",
      dataIndex: "speciality",
      key: "specialty",
      responsive: ["sm", "md", "lg"],
      filters: getSpecialties(),
      onFilter: (value, record) => record.speciality === value,
      sorter: (a, b) => a.speciality.localeCompare(b.speciality),
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      responsive: ["md", "lg"],
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Aksiyonlar",
      key: "action",
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
            title="Bu doktoru silmek istediğinizden emin misiniz?"
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
        dataSource={filteredDoctors}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </div>
  );
};

DoctorTable.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default DoctorTable;