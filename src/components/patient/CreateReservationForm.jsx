import { DatePicker, Form, Modal, Select, TimePicker } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecialties } from "../../redux/slices/specialities-thunk";

import { useFormik } from "formik";
import * as yup from "yup";
import { getAllDoctorsBySpecialtyId } from "../../services/reservation-service";
import { createReservation } from "../../services/patient-service";
import { setOperation } from "../../redux/slices/misc-slice";

const CreateReservationForm = ({ visible, onCancel }) => {
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
  
  const user = useSelector((state) => state.auth.user);
  
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    console.log("Kullanıcı bilgileri:", {
      id: user?.id,
      role: user?.role,
      token: token
    });
  }, [user]);
  
  const formik = useFormik({
    initialValues: {
      speciality: "",
      doctor: "",
      reservationDate: "",
      reservationTime: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (!user?.role?.includes('PATIENT')) {
          Modal.error({
            title: 'Yetki Hatası',
            content: 'Bu işlemi yapmak için hasta rolüne sahip olmanız gerekiyor.'
          });
          console.log("setOperation çağrılıyor...")
          return;
        }
        
        console.log("CreateReservationForm.jsx values:", values);
        const payload = {
          doctor: {
            id: values.doctor
          },
          date: values.reservationDate.format('YYYY-MM-DD'),
          time: values.reservationTime.format('HH:mm'),
          status: "CONFIRMED",
          speciality: specialties.find(s => s.id === values.speciality)?.name,
          patient: {
            id: user.id
          },
          reservationDate: values.reservationDate.format('YYYY-MM-DD'),
          reservationTime: values.reservationTime.format('HH:mm')
        };
        
        
        await createReservation(payload);
        Modal.success({
          title: 'Başarılı',
          content: 'Randevu başarıyla oluşturuldu.'
        });
        dispatch(setOperation(Math.random()));
        onCancel();
      } catch (error) {
        console.error("Randevu oluşturulurken hata:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        Modal.error({
          title: 'Hata',
          content: 'Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.'
        });
      }
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
  onCancel: PropTypes.func.isRequired,
};

export default CreateReservationForm;