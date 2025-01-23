import { DatePicker, Form, Modal, Select } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecialties } from "../../redux/slices/specialities-thunk";

import { useFormik } from "formik";
import * as yup from "yup";
import { getAllDoctorsBySpecialtyId, getDoctorReservations, getReservationsByPatientId } from "../../services/reservation-service";
import { createReservation } from "../../services/patient-service";
import { setOperation, setListRefreshToken } from "../../redux/slices/misc-slice";
import { ChevronUp, ChevronDown } from "lucide-react";
import moment from 'moment';

const CreateReservationForm = ({ visible, onCancel }) => {
  
  const [form] = Form.useForm(); // Ant Design formunu oluşturmak ve yönetmek için kullanılır
  const dispatch = useDispatch(); // Redux dispatch fonksiyonunu kullanmak için hook
  const specialties = useSelector((state) => state.specialties); // Redux store'dan uzmanlıkları almak için hook
  const [doctors, setDoctors] = useState([]); // Doktor listesini tutmak için state
  const [speciality, setSpeciality] = useState([]); // Seçilen uzmanlığı tutmak için state
  const [expandedTime, setExpandedTime] = useState(null); // Genişletilmiş zaman dilimini tutmak için state
  const [bookedSlots, setBookedSlots] = useState([]); // Randevu için dolu zaman dilimlerini tutmak için state

  const timeSlots = { // Randevu zaman dilimlerini ve doluluk durumlarını tanımlayan nesne
    '09:00': [
      { time: '09:00', isBooked: false },
      { time: '09:10', isBooked: false },
      { time: '09:20', isBooked: false },
      { time: '09:30', isBooked: false },
      { time: '09:40', isBooked: false },
      { time: '09:50', isBooked: false }
    ],
    '10:00': [
      { time: '10:00', isBooked: false },
      { time: '10:10', isBooked: false },
      { time: '10:20', isBooked: false },
      { time: '10:30', isBooked: false },
      { time: '10:40', isBooked: false },
      { time: '10:50', isBooked: false }
    ],
    '11:00': [
      { time: '11:00', isBooked: false },
      { time: '11:10', isBooked: false },
      { time: '11:20', isBooked: false },
      { time: '11:30', isBooked: false },
      { time: '11:40', isBooked: false },
      { time: '11:50', isBooked: false }
    ],
    '13:00': [
      { time: '13:00', isBooked: false },
      { time: '13:10', isBooked: false },
      { time: '13:20', isBooked: false },
      { time: '13:30', isBooked: false },
      { time: '13:40', isBooked: false },
      { time: '13:50', isBooked: false }
    ],
    '14:00': [
      { time: '14:00', isBooked: false },
      { time: '14:10', isBooked: false },
      { time: '14:20', isBooked: false },
      { time: '14:30', isBooked: false },
      { time: '14:40', isBooked: false },
      { time: '14:50', isBooked: false }
    ],
    '15:00': [
      { time: '15:00', isBooked: false },
      { time: '15:10', isBooked: false },
      { time: '15:20', isBooked: false },
      { time: '15:30', isBooked: false },
      { time: '15:40', isBooked: false },
      { time: '15:50', isBooked: false }
    ],
    '16:00': [
      { time: '16:00', isBooked: false },
      { time: '16:10', isBooked: false },
      { time: '16:20', isBooked: false },
      { time: '16:30', isBooked: false },
      { time: '16:40', isBooked: false },
      { time: '16:50', isBooked: false }
    ]
  };

  const toggleTimeSlot = (time) => { // Zaman dilimini genişletmek veya daraltmak için fonksiyon
    setExpandedTime(expandedTime === time ? null : time);
  };
  // Form doğrulama şeması tanımlar
  const validationSchema = yup.object().shape({
    speciality: yup.string().required("Uzmanlık seçilmedi"),
    doctor: yup.string().required("Doktor seçilmedi"),
    reservationDate: yup.string().required("Randevu tarihi seçilmedi"),
    reservationTime: yup.string().required("Randevu saati seçilmedi"),
  });
  
  const user = useSelector((state) => state.auth.user);
  
  // Formik ile form yönetimi ve gönderim işlemleri
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
        // Randevu saatini 'HH:mm' formatında moment nesnesine dönüştürür
        const reservationTime = moment(values.reservationTime, 'HH:mm'); 
        // Kullanıcının hasta rolüne sahip olup olmadığını kontrol eder
        if (!user?.role?.includes('PATIENT')) {
          Modal.error({
            title: 'Yetki Hatası',
            content: 'Bu işlemi yapmak için hasta rolüne sahip olmanız gerekiyor.'
          });
          console.log("setOperation çağrılıyor...")
          return;
        }
        
        
        const payload = {
          doctor: {
            id: values.doctor
          },
          date: values.reservationDate.format('YYYY-MM-DD'),
          time: reservationTime.format('HH:mm'),
          status: "CONFIRMED",
          speciality: specialties.find(s => s.id === values.speciality)?.name,
          patient: {
            id: user.id
          },
          reservationDate: values.reservationDate.format('YYYY-MM-DD'),
          reservationTime: reservationTime.format('HH:mm')
        };
        
        // Randevu oluşturma işlemi
        await createReservation(payload);
        Modal.success({
          title: 'Başarılı',
          content: 'Randevu başarıyla oluşturuldu.'
        });
        dispatch(setOperation(Math.random()));
        dispatch(setListRefreshToken(Math.random()));
        handleDoctorChange(values.doctor);
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
  
  // Uzmanlıkları getirir ve state'e kaydeder
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchSpecialties()); // Uzmanlıkları API'den getirir ve Redux state'ine kaydeder
      setSpeciality(specialties); // Uzmanlıkları local state'e kaydeder
    };
    
    fetchData(); // fetchData fonksiyonunu çağırır
  }, [dispatch, speciality]); // dispatch ve speciality değiştiğinde useEffect'i yeniden çalıştırır
  
  // Formu görünürlük değiştiğinde sıfırlar
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  // Seçilen uzmanlığa göre doktorları getirir
  const handleSpecialtyChange = async (selectedSpecialtyId) => {
    try {
      const response = await getAllDoctorsBySpecialtyId(selectedSpecialtyId);
    
      setDoctors(response);
      // Uzmanlık değiştiğinde formu tamamen sıfırla
      formik.setFieldValue("speciality", selectedSpecialtyId);
      formik.setFieldValue("doctor", "");
      formik.setFieldValue("reservationDate", "");
      formik.setFieldValue("reservationTime", "");
      form.resetFields(["doctor", "reservationDate", "reservationTime"]);
    } catch (error) {
      console.error("Doktorlar getirilirken hata oluştu:", error);
    }
  };

  const handleDoctorChange = async (doctorId) => {
    try {
      const doctorReservations = await getDoctorReservations(doctorId);
      const patientReservations = await getReservationsByPatientId(user.id);
      const allReservations = [...doctorReservations, ...patientReservations];
      const bookedTimes = allReservations
        .filter(res => res.status !== 'CANCELLED')
        .map(res => ({
          date: res.reservationDate,
          time: res.reservationTime.substring(0, 5) // 'HH:mm:ss' formatından 'HH:mm' formatına dönüştür
        }));
      setBookedSlots(bookedTimes);
    } catch (error) {
      console.error("Randevular getirilirken hata oluştu:", error);
    }
  };

  return (
    <Modal
      title="Yeni Randevu Ekle" // Modal başlığı
      open={visible} // Modal'ın görünür olup olmadığını belirler
      onOk={() => formik.handleSubmit()} // Tamam butonuna basıldığında formu gönderir
      onCancel={onCancel} // İptal butonuna basıldığında çalışacak fonksiyon
    >
      <Form form={form} layout="vertical"> 
        <Form.Item label="Uzmanlık" name="speciality" rules={[{ required: true }]}> 
          <Select 
            placeholder="Bir uzmanlık seçiniz"
            onChange={(value) => {
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
          <Select
            placeholder="Bir doktor seçiniz"
            options={doctors.map((doctor) => ({
              label: doctor.ad + " " + doctor.soyad,
              value: doctor.id,
              key: doctor.id,
            }))}
            onChange={(value) => {
              formik.setFieldValue("doctor", value);
              handleDoctorChange(value);
            }}
            value={formik.values.doctor}
            onBlur={formik.handleBlur}
            error={formik.errors.doctor}
          />
        </Form.Item>
        <Form.Item label="Randevu Tarihi" name="reservationDate" rules={[{ required: true }]}> 
          <DatePicker
            name="reservationDate"
            placeholder="YYYY-MM-DD"
            format="YYYY-MM-DD"
            disabledDate={(current) => {
              const now = moment();
              const isAfter5PM = now.hour() >= 17;
              // Eğer saat 17:00'den sonraysa bugünü de devre dışı bırak
              return current && (
                current < (isAfter5PM ? now.endOf('day') : now.startOf('day'))
              );
            }}
            onChange={(value) => {
              formik.setFieldValue("reservationDate", value);
              // Tarih değiştiğinde randevu saatini sıfırla
              formik.setFieldValue("reservationTime", "");
            }}
            value={formik.values.reservationDate}
            error={formik.errors.reservationDate}
          />
        </Form.Item>
        <Form.Item
          label="Randevu Saati"
          name="reservationTime"
        >
          {formik.values.speciality && formik.values.doctor && formik.values.reservationDate ? ( // Eğer uzmanlık, doktor ve tarih seçilmişse saatleri göster
            <div className="space-y-2">
              {Object.entries(timeSlots).map(([time, subSlots]) => (
                <div key={time} className="border rounded-lg">
                  <div
                    className="flex items-center p-4 cursor-pointer"
                    onClick={() => toggleTimeSlot(time)}
                  >
                    {expandedTime === time ? (
                      <ChevronUp className="w-5 h-5 mr-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 mr-2" />
                    )}
                    <span>{time}</span>
                  </div>
                  {expandedTime === time && subSlots.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 p-4 pt-0">
                      {subSlots.map((slot) => {
                        // Debug için bookedSlots'u kontrol et
                        
                        
                        const isBooked = bookedSlots.some(
                          (b) => b.date === formik.values.reservationDate.format('YYYY-MM-DD') && b.time === slot.time
                        );
                        const isSelected = formik.values.reservationTime === slot.time;
                        
                        // Gerçek tarihi manuel olarak ayarla
                        const currentDate = moment('2024-01-23').set({ hour: 18, minute: 53 }); // Bugünün tarihi ve saati
                        const slotTime = moment(slot.time, 'HH:mm');
                        const selectedDate = formik.values.reservationDate.clone(); // clone() ile yeni bir moment nesnesi oluştur
                        
                
                        
                        // Seçilen tarih bugünden büyükse hiçbir kısıtlama olmasın
                        const isToday = selectedDate.isSame(currentDate, 'day');
                    
                        
                        // Sadece bugün için geçmiş saat kontrolü yap
                        const isPastTime = isToday && 
                          (slotTime.hour() < currentDate.hour() || 
                          (slotTime.hour() === currentDate.hour() && slotTime.minute() <= currentDate.minute()));
                        
                        // Sadece bugün için geçmiş saat kısıtlaması uygula
                        const isDisabled = isBooked || (isToday && isPastTime);

      
                        return (
                          <button
                            key={slot.time}
                            disabled={isDisabled}
                            className={`px-4 py-2 rounded-lg ${
                              isDisabled
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                                : isSelected
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                            onClick={() => formik.setFieldValue("reservationTime", slot.time)}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Lütfen önce uzmanlık, doktor ve randevu tarihini seçiniz.</p> // Seçimler tamamlanmamışsa uyarı mesajı göster
          )}
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