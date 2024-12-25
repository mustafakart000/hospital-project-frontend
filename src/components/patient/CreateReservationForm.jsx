import { DatePicker, Form, Modal, Select, TimePicker } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecialties } from "../../redux/slices/specialities-thunk";

import { useFormik } from "formik";
import * as yup from "yup";
import { getAllDoctorsBySpecialtyId } from "../../services/reservation-service";

const CreateReservationForm = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const specialties = useSelector((state) => state.specialties);
  const [doctors, setDoctors] = useState([]);
  const [speciality, setSpeciality] = useState([]);
  const validationSchema = yup.object().shape({
    speciality: yup.string().required("Uzmanlık seçilmedi"),
    doctor: yup.string().required("Doktor seçilmedi"),
    reservationDate: yup.string().required("Randevu tarihi seçilmedi"),
    reservationTime: yup.string().required("Randevu saati seçilmedi"),
  });
  const formik = useFormik({
    initialValues: {
      speciality: "",
      doctor: "",
      reservationDate: "",
      reservationTime: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("CreateReservationForm.jsx values:", values);
      onSubmit(values);
    },
  });
  
  
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
     const response = await getAllDoctorsBySpecialtyId(selectedSpecialtyId);
     console.log("createReservationForm.jsx response", response);
      setDoctors(response);
    } catch (error) {
      console.error("Doktorlar getirilirken hata oluştu:", error);
    }
  };

  return (
    <Modal
      title="Yeni Randevu Ekle"
      open={visible}
      onOk={() => formik.handleSubmit()}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Uzmanlık" name="speciality" rules={[{ required: true }]}>
          <Select 

            placeholder="Bir uzmanlık seçiniz" 
            onChange={(value) => {
              console.log("createReservationForm.jsx value", value);
              formik.setFieldValue("speciality", value);
              handleSpecialtyChange(value);
            }}
            options={specialties && specialties.map((specialty) => ({
              label: specialty.name,
              value: specialty.id
            }))} 

            value={formik.values.speciality}
            onBlur={formik.handleBlur}
            error={formik.errors.speciality}
          />
        </Form.Item>
        <Form.Item label="Doktor" name="doctor" rules={[{ required: true }]}>
          <Select placeholder="Bir doktor seçiniz" options={doctors && doctors.map((doctor) => ({
            label:doctor.ad + " " + doctor.soyad,
            value: doctor.id,
            key: doctor.id,
            

          }))}
          onChange={(value) => formik.setFieldValue("doctor", value)}
          value={formik.values.doctor}
          onBlur={formik.handleBlur}
          error={formik.errors.doctor}
           />
        </Form.Item>
        <Form.Item label="Randevu Tarihi" name="reservationDate" rules={[{ required: true }]}>
          <DatePicker 
            placeholder="YYYY-MM-DD" 
            format="YYYY-MM-DD"
            onChange={(value) => formik.setFieldValue("reservationDate", value)}
            value={formik.values.reservationDate}
            onBlur={formik.handleBlur}
            error={formik.errors.reservationDate}
          />
        </Form.Item>
        <Form.Item label="Randevu Saati" name="reservationTime" rules={[{ required: true }]}>
          <TimePicker 
            placeholder="HH:MM" 
            format="HH:mm"
            minuteStep={15}
            showNow={false}
            onChange={(value) => formik.setFieldValue("reservationTime", value)}
            value={formik.values.reservationTime}
            onBlur={formik.handleBlur}
            error={formik.errors.reservationTime}
          />
          
        </Form.Item>
      </Form>
    </Modal>
  );
};

CreateReservationForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateReservationForm;
