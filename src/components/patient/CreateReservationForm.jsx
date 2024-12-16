import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecialties } from "../../redux/slices/specialities-thunk";

const CreateReservationForm = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const specialties = useSelector((state) => state.specialties);

  useEffect(() => {
    dispatch(fetchSpecialties());
    console.log("specialties",specialties);
  }, [dispatch]);
  
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  return (
    <Modal
      title="Yeni Randevu Ekle"
      open={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Doktor ID" name="doctorId" rules={[{ required: true }]}>
          <Input placeholder="Doktor ID" />
        </Form.Item>
        <Form.Item label="Hasta ID" name="patientId" rules={[{ required: true }]}>
          <Input placeholder="Hasta ID" />
        </Form.Item>
        <Form.Item label="Tarih" name="date" rules={[{ required: true }]}>
          <Input placeholder="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Saat" name="time" rules={[{ required: true }]}>
          <Input placeholder="HH:MM" />
        </Form.Item>
        <Form.Item label="Uzmanlık" name="speciality" rules={[{ required: true }]}>
          <Input placeholder="Uzmanlık Alanı" />
        </Form.Item>
        <Form.Item label="Randevu Tarihi" name="reservationDate" rules={[{ required: true }]}>
          <Input placeholder="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Randevu Saati" name="reservationTime" rules={[{ required: true }]}>
          <Input placeholder="HH:MM" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

CreateReservationForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateReservationForm;
