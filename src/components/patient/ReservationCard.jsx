import React from "react";
import { Card, Button, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import PropTypes from 'prop-types';
const ReservationCard = ({ reservation, onDelete, onEdit }) => {
  return (
    <Card
      hoverable
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        borderRadius: "10px",
      }}
      title={
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>
          {reservation.speciality}
        </div>
      }
      actions={[
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEdit(reservation.id)}
        >
          Düzenle
        </Button>,
        <Popconfirm
          key="delete"
          title="Bu kaydı silmek istediğinize emin misiniz?"
          onConfirm={() => onDelete(reservation.id)}
          okText="Evet"
          cancelText="Hayır"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Sil
          </Button>
        </Popconfirm>,
      ]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
        <div>
          <UserOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
          <strong>Doktor:</strong> {reservation.doctorName} {reservation.doctorSurname}
        </div>
        <div>
          <UserOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
          <strong>Hasta:</strong> {reservation.patientName} {reservation.patientSurname}
        </div>
        <div>
          <CalendarOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
          <strong>Tarih:</strong> {reservation.reservationDate}
        </div>
        <div>
          <ClockCircleOutlined style={{ marginRight: "8px", color: "#faad14" }} />
          <strong>Saat:</strong> {reservation.reservationTime}
        </div>
        <div>
          <CheckCircleOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
          <strong>Durum:</strong> {reservation.status}
        </div>
      </div>
    </Card>
  );
};
ReservationCard.propTypes = {
  reservation: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default ReservationCard;
// Compare this snippet from src/pages/dashboards/adminPage/AdminPanelPage.jsx:
