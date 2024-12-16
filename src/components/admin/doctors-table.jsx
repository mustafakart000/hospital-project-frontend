import React, { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm } from "antd";
import { TbUserEdit } from "react-icons/tb";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { deleteDoctor, getAllDoctors } from "../../services/doctor-service";
const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Doktorları API’den çekmek için fonksiyon
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors();
        
        const data = response;
        // ad ve soyadı birleştirerek name alanını oluşturuyoruz
        const formattedDoctors = data.map((doctor) => {
          const { ad, soyad, phone, speciality, id } = doctor; // İlgili alanları destructure ettik
          return {
            name: `${ad} ${soyad}`, // ad ve soyadı birleştirip name olarak atıyoruz
            phone,
            speciality,
            id: id,
          }; // Yeni format oluşturuyoruz
        });
        // const {ad, soyad, telefon, speciality} = { ...data};
        setDoctors(formattedDoctors);
      } catch (error) {
        console.error("Doktorları çekerken hata oluştu:", error);
      }
    };

    fetchDoctors(); // UseEffect içinde fonksiyon tanımlandıktan sonra çağırıyoruz
  }, []); // Boş dizi => bileşen ilk yüklendiğinde çalışır

  const handleEdit = (record) => {
    console.log("Düzenlenecek doktor:", record);
    navigate(`/dashboard/doctor-management/edit/${record.id}`);

    console.log("navigate: ", navigate);
  }
  const handleDelete = (key) => {
    
    console.log("Silinecek doktorun anahtarı (key):", key);
    deleteDoctor(key);
    toast.success("Doktor başarıyla silindi");
    setDoctors((prev) => prev.filter((doc) => doc.id !== key));
  };

  const columns = [
    {
      title: "İsim",
      dataIndex: "name",
      key: "name",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Uzmanlık",
      dataIndex: "speciality",
      key: "specialty",
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      responsive: ["md", "lg"],
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
    <Table
      columns={columns}
      dataSource={doctors}
      rowKey={(record) => record.id}
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  );
};

export default DoctorTable;
