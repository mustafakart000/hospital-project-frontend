import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Input, List, Card } from "antd";
import { TbUserEdit } from "react-icons/tb";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { useMediaQuery } from 'react-responsive';
import { deleteTechnicianById, getAllTechnicians } from "../../services/technicians-service";

const TechnicianTable = ({ activeTab }) => {
  const [technicians, setTechnicians] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 580 });

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await getAllTechnicians();
        const formattedTechnicians = response.map((technician) => {
          const { ad, soyad, telefon, department, specialization, id } = technician;
          return {
            name: `${ad} ${soyad}`,
            phone: telefon,
            department,
            specialization,
            id: id,
          };
        });
        setTechnicians(formattedTechnicians);
        setFilteredTechnicians(formattedTechnicians);
      } catch (error) {
        console.error("Teknisyenleri çekerken hata oluştu:", error);
      }
    };

    fetchTechnicians();
  }, [activeTab==="list"]);

  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = technicians.filter((technician) =>
      Object.values(technician).some(
        (val) =>
          val &&
          val.toString().toLowerCase().includes(searchValue)
      )
    );
    setFilteredTechnicians(filtered);
    setSearchText(value);
  };

  const handleEdit = (record) => {
    navigate(`/dashboard/technician-management/edit/${record.id}`);
  };

  const showDeleteConfirm = (technicianId) => {
    setSelectedTechnicianId(technicianId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedTechnicianId) {
      try {
        await deleteTechnicianById(selectedTechnicianId);
        toast.success("Teknisyen başarıyla silindi");
        const updatedTechnicians = technicians.filter((tech) => tech.id !== selectedTechnicianId);
        setTechnicians(updatedTechnicians);
        setFilteredTechnicians(updatedTechnicians);
      } catch (error) {
        console.error("Silme işlemi sırasında hata:", error);
        toast.error("Silme işlemi başarısız oldu");
      }
      setIsDeleteModalVisible(false);
    }
  };

  const getDepartments = () => {
    const departments = [...new Set(technicians.map(tech => tech.department))];
    return departments.map(department => ({
      text: department,
      value: department,
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
      filters: technicians.map(tech => ({
        text: tech.name,
        value: tech.id,
      })),
      onFilter: (value, record) => record.id === value,
    },
    {
      title: "Departman",
      dataIndex: "department",
      key: "department",
      width: 150,
      responsive: ["sm", "md", "lg"],
      filters: getDepartments(),
      onFilter: (value, record) => record.department === value,
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: "Uzmanlık",
      dataIndex: "specialization",
      key: "specialization",
      width: 150,
      responsive: ["md", "lg"],
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      responsive: ["md", "lg"],
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

  // ... Mobile görünüm ve Modal kodu DoctorTable ile aynı ...

  return (
    <div>
      <Input.Search
        placeholder="Teknisyen ara..."
        allowClear
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 200 }}
      />
      {!isMobile ? (
        <Table
          columns={columns}
          dataSource={filteredTechnicians}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredTechnicians}
          pagination={{
            onChange: () => {
              window.scrollTo(0, 0);
            },
            pageSize: 10,
            total: filteredTechnicians.length,
            showTotal: (total) => `Toplam ${total} kayıt`,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          renderItem={(technician) => (
            <List.Item>
              <Card>
                <div className="flex flex-col gap-2">
                  <div className="font-medium text-lg">{technician.name}</div>
                  <div>
                    <span className="text-gray-500">Departman:</span> {technician.department}
                  </div>
                  <div>
                    <span className="text-gray-500">Uzmanlık:</span> {technician.specialization}
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span> {technician.phone}
                  </div>
                  <Space size="small" className="mt-2">
                    <Button
                      type="default"
                      size="small"
                      className="text-emerald-500 hover:text-yellow-400 hover:border-emerald-600"
                      onClick={() => handleEdit(technician)}
                    >
                      <TbUserEdit />
                    </Button>
                    <Button
                      type="default"
                      size="small"
                      danger
                      className="text-red-500 hover:text-yellow-400 hover:border-red-600"
                      onClick={() => showDeleteConfirm(technician.id)}
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
          <span style={{ color: '#faad14', fontSize: '18px' }}>Teknisyeni Sil</span>
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
          }
        }}
        cancelButtonProps={{
          style: { marginRight: '8px' }
        }}
      >
        <div style={{ fontSize: '16px', marginTop: '16px' }}>
          <p>Bu teknisyeni silmek istediğinizden emin misiniz?</p>
          <p style={{ color: '#8c8c8c', marginTop: '8px' }}>Not: Silinen teknisyen kaydı sistem tarafından kalıcı olarak silinecektir ve geri alınamaz.</p>
        </div>
      </Modal>
    </div>
  );
};

TechnicianTable.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default TechnicianTable;