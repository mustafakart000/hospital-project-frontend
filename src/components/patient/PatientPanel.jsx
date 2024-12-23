import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { config } from "../../helpers/config";
import { getAuthHeader } from "../../services/auth-header";
import axios from "axios";
import ReservationList from "./ReservationList";
import CreateReservationForm from "./CreateReservationForm";
import UpdateReservationForm from "./UpdateReservationForm";

const PatientPanel = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  const BASE_URL = config.api.baseUrl;

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/reservations/getall`, {
        headers: getAuthHeader(),
      });
      setReservations(response.data);
    } catch (error) {
      console.log("PatientPanel.jsx fetchReservations error: ", error);
      message.error("Randevular getirilirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await axios.post(`${BASE_URL}/reservations/create`, values, {
        headers: getAuthHeader(),
      });
      message.success("Randevu başarıyla eklendi!");
      fetchReservations();
      setIsCreateModalVisible(false);
    } catch (error) {
      console.log("PatientPanel.jsx handleCreate error: ", error);
      message.error("Ekleme sırasında hata oluştu.");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(`${BASE_URL}/reservations/update/${editingReservation.id}`, values, {
        headers: getAuthHeader(),
      });
      message.success("Randevu başarıyla güncellendi!");
      fetchReservations();
      setIsUpdateModalVisible(false);
      setEditingReservation(null);
    } catch (error) {
      console.log("PatientPanel.jsx handleUpdate error: ", error);
      message.error("Güncelleme sırasında hata oluştu.");
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setIsUpdateModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/reservations/delete/${id}`, { headers: getAuthHeader() });
      fetchReservations();
    } catch (error) {
      console.log("PatientPanel.jsx handleDelete error: ", error);
      message.error("Silme sırasında hata oluştu.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Hasta Randevu Yönetimi</h2>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsCreateModalVisible(true)}
        style={{ marginBottom: "20px" }}
      >
        Yeni Randevu Ekle
      </Button>

      <ReservationList
        reservations={reservations}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateReservationForm
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreate}
      />

      {editingReservation && (
        <UpdateReservationForm
          visible={isUpdateModalVisible}
          onCancel={() => setIsUpdateModalVisible(false)}
          onSubmit={handleUpdate}
          initialValues={editingReservation}
        />
      )}
    </div>
  );
};

export default PatientPanel;
