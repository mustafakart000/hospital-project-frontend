import { DatePicker, Form, Modal, Select, TimePicker } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecialties } from "../../redux/slices/specialities-thunk";
import axios from "axios";
import { getAuthHeader } from "../../services/auth-header";


const CreateReservationForm = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const specialties = useSelector((state) => state.specialties);
  const [doctors, setDoctors] = useState([]);
  const [speciality, setSpeciality] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchSpecialties());
      setSpeciality(specialties);
    };
    
    fetchData();
  }, [dispatch, speciality]);
  
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSpecialtyChange = async (selectedSpecialtyId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/reservations/getall/doctors/${selectedSpecialtyId}`,
        { headers: getAuthHeader() }
      );
      setDoctors(response.data);
    } catch (error) {
      console.error("Doktorlar getirilirken hata oluştu:", error);
    }
  };

  return (
    <Modal
      title="Yeni Randevu Ekle"
      open={visible}
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Uzmanlık" name="speciality" rules={[{ required: true }]}>
          <Select 
            placeholder="Bir uzmanlık seçiniz" 
            onChange={handleSpecialtyChange}
            options={specialties.map((specialty) => ({
              label: specialty.name,
              value: specialty.id
            }))} 
          />
        </Form.Item>
        <Form.Item label="Doktor" name="doctor" rules={[{ required: true }]}>
          <Select placeholder="Bir doktor seçiniz" options={doctors.map((doctor) => ({
            label:doctor.ad + " " + doctor.soyad,
            value: doctor.id,
            key: doctor.id,
            

          }))} />
        </Form.Item>
        <Form.Item label="Randevu Tarihi" name="reservationDate" rules={[{ required: true }]}>
          <DatePicker placeholder="YYYY-MM-DD" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Randevu Saati" name="reservationTime" rules={[{ required: true }]}>
          <TimePicker 
            placeholder="HH:MM" 
            format="HH:mm"
            minuteStep={15}
            showNow={false}
          />
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
