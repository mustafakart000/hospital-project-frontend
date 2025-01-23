import React, { useState, useEffect } from 'react';
import { Card, Skeleton, Avatar, Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { UserCircle, Mail, Phone, MapPin, Calendar, Activity, Bookmark, Award, Droplet, Edit } from 'lucide-react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getDoctorById, updateDoctor } from '../../services/doctor-service';

// Mesaj konfigürasyonu
message.config({
  top: 40, // Mesajın üstten uzaklığı (piksel cinsinden)
  duration: 3, // Mesajın ekranda kalma süresi (saniye cinsinden)
  maxCount: 1, // Aynı anda gösterilecek maksimum mesaj sayısı
});

const ProfileItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-3 py-2">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

ProfileItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const doctorId = useSelector(state => state.auth.user.id);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await getDoctorById(doctorId);
      setDoctor(response);
    } catch (err) {
      setError('Profil bilgileri yüklenirken bir hata oluştu');
      console.error('Profil yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  useEffect(() => {
    if (doctor && isEditModalVisible) {
      form.setFieldsValue({
        ...doctor,
        birthDate: dayjs(doctor.birthDate),
        phone: doctor.phone || doctor.telefon,
        address: doctor.address || doctor.adres
      });
    }
  }, [doctor, isEditModalVisible]);

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const updateData = {
        username: doctor.username,
        ad: values.ad,
        soyad: values.soyad,
        email: values.email,
        telefon: values.phone,
        adres: values.address,
        birthDate: values.birthDate.format('YYYY-MM-DD'),
        tcKimlik: values.tcKimlik,
        kanGrubu: values.kanGrubu,
        diplomaNo: values.diplomaNo,
        unvan: values.unvan,
        uzmanlik: doctor.speciality
      };

      await updateDoctor(doctorId, updateData);
      
      await fetchDoctorProfile();
      setIsEditModalVisible(false);
      form.resetFields();
      
      message.success('Profil başarıyla güncellendi');
    } catch (error) {
      console.error('Güncelleme sırasında hata:', error);
      message.error('Güncelleme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !doctor) {
    return (
      <Card className="shadow-sm">
        <Skeleton avatar active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm">
        <div className="text-center text-red-500">{error}</div>
      </Card>
    );
  }

  if (!doctor) return null;

  return (
    <div className="space-y-6">
      {/* Header with Avatar */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <Avatar
          size={96}
          icon={<UserCircle />}
          className="bg-blue-100 text-blue-600"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-900">
            {doctor.unvan} {doctor.ad} {doctor.soyad}
          </h2>
          <p className="text-lg text-gray-600">{doctor.speciality}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>

      {/* Profile Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ProfileItem
            icon={Mail}
            label="Email"
            value={doctor.email}
          />
          <ProfileItem
            icon={UserCircle}
            label="Kullanıcı Adı"
            value={doctor.username}
          />
          <ProfileItem
            icon={MapPin}
            label="Adres"
            value={doctor.address || doctor.adres}
          />
          <ProfileItem
            icon={Calendar}
            label="Doğum Tarihi"
            value={new Date(doctor.birthDate).toLocaleDateString('tr-TR')}
          />
          <ProfileItem
            icon={Phone}
            label="Telefon"
            value={doctor.phone || doctor.telefon}
          />
        </div>

        <div className="space-y-4">
          <ProfileItem
            icon={Droplet}
            label="Kan Grubu"
            value={doctor.kanGrubu}
          />
          <ProfileItem
            icon={Award}
            label="Diploma No"
            value={doctor.diplomaNo}
          />
          <ProfileItem
            icon={Activity}
            label="Uzmanlık"
            value={doctor.speciality}
          />
          <ProfileItem
            icon={Bookmark}
            label="TC Kimlik"
            value={doctor.tcKimlik}
          />
        </div>
      </div>

      {/* Edit Button */}
      <div className="flex justify-end mt-6">
        <Button 
          type="primary"
          icon={<Edit className="w-4 h-4" />}
          onClick={handleEdit}
          className="bg-blue-600"
        >
          Profili Düzenle
        </Button>
      </div>

      {/* Edit Modal */}
      {isEditModalVisible && (
        <Modal
          title="Profil Bilgilerini Düzenle"
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            className="mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="unvan"
                label="Unvan"
                rules={[{ required: true, message: 'Unvan gereklidir' }]}
              >
                <Select>
                  <Select.Option value="Dr.">Dr.</Select.Option>
                  <Select.Option value="Doc.">Doc.</Select.Option>
                  <Select.Option value="Prof.">Prof.</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="ad"
                label="Ad"
                rules={[{ required: true, message: 'Ad gereklidir' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="soyad"
                label="Soyad"
                rules={[{ required: true, message: 'Soyad gereklidir' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Email gereklidir' },
                  { type: 'email', message: 'Geçerli bir email giriniz' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="username"
                label="Kullanıcı Adı"
                rules={[{ required: true, message: 'Kullanıcı adı gereklidir' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="address"
                label="Adres"
                rules={[{ required: true, message: 'Adres gereklidir' }]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                name="diplomaNo"
                label="Diploma No"
                rules={[{ required: true, message: 'Diploma no gereklidir' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="birthDate"
                label="Doğum Tarihi"
                rules={[{ required: true, message: 'Doğum tarihi gereklidir' }]}
              >
                <DatePicker
                  className="w-full border rounded-md shadow-sm"
                  style={{ width: "100%" }}
                  placeholder="Doğum Tarihi Seçiniz"
                  onChange={(date) => form.setFieldsValue({ birthDate: date })}
                  value={form.getFieldValue('birthDate') ? dayjs(form.getFieldValue('birthDate'), 'YYYY-MM-DD') : null}
                  format="YYYY-MM-DD"
                  popupClassName="bg-white border rounded-md shadow-lg"
                />
              </Form.Item>

              <Form.Item
                name="kanGrubu"
                label="Kan Grubu"
                rules={[{ required: true, message: 'Kan grubu gereklidir' }]}
              >
                <Select>
                  <Select.Option value="A+">A+</Select.Option>
                  <Select.Option value="A-">A-</Select.Option>
                  <Select.Option value="B+">B+</Select.Option>
                  <Select.Option value="B-">B-</Select.Option>
                  <Select.Option value="AB+">AB+</Select.Option>
                  <Select.Option value="AB-">AB-</Select.Option>
                  <Select.Option value="0+">0+</Select.Option>
                  <Select.Option value="0-">0-</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="phone"
                label="Telefon"
                rules={[{ required: true, message: 'Telefon gereklidir' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="tcKimlik"
                label="TC Kimlik"
                rules={[{ required: true, message: 'TC Kimlik gereklidir' }]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={() => setIsEditModalVisible(false)}>
                İptal
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Güncelle
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default DoctorProfile;