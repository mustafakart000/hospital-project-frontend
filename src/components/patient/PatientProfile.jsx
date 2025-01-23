import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Form, Input, DatePicker, Select, Modal } from 'antd';
import { User, Mail, Phone, MapPin, Heart, AlertTriangle, Clock, Edit } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { getPatientProfile, updatePatient } from '../../services/patient-service';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const patientId = useSelector(state => state.auth.user.id.toString());
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ maxWidth: 1510 });

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      const response = await getPatientProfile(patientId);
      setPatient(response);
    } catch (error) {
      console.error('Profil bilgileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientProfile();
  }, [patientId]);

  const handleEdit = () => {
    form.setFieldsValue({
      ...patient,
      birthDate: dayjs(patient.birthDate),
      telefon: patient.telefon,
      adres: patient.adres
    });
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditModalVisible(false);
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      await updatePatient(patientId, {
        ad: values.ad,
        soyad: values.soyad,
        email: values.email,
        telefon: values.telefon,
        adres: values.adres,
        dogumTarihi: values.birthDate.format('YYYY-MM-DD'),
        kanGrubu: values.kanGrubu
      });
      await fetchPatientProfile();
      setIsEditModalVisible(false);
      message.success('Profil başarıyla güncellendi.');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const InfoItem = ({ icon: Icon, label, value, className }) => (
    <div className={`flex items-center space-x-3 py-2 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );

  InfoItem.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  if (loading || !patient) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Header - Mobilde gizlenecek */}
      <div className={isMobile ? 'hidden' : 'flex flex-col md:flex-row items-start md:items-center justify-between mb-6'}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Profil Bilgilerim</h2>
        <Button
          type="primary"
          icon={<Edit className="w-4 h-4" />}
          onClick={handleEdit}
          className="bg-blue-600 w-full md:w-auto"
        >
          Profili Düzenle
        </Button>
      </div>

      {/* Ana Grid */}
      <div className={`grid gap-6 ${
        isMobile ? 'grid-cols-1' : 
        isTablet ? 'grid-cols-2' : 
        'grid-cols-3'
      }`}>
        {/* Kişisel Bilgiler */}
        <Card title="Kişisel Bilgiler" className="shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 mb-6">
              <Avatar 
                size={64} 
                icon={<User />} 
                className="bg-blue-100 text-blue-600 mb-4 md:mb-0" 
              />
              <div>
                <h3 className="text-lg font-medium text-center md:text-left">
                  {patient?.ad} {patient?.soyad}
                </h3>
              </div>
            </div>
            <InfoItem icon={Mail} label="E-posta" value={patient?.email} />
            <InfoItem icon={Phone} label="Telefon" value={patient?.telefon} />
            <InfoItem icon={MapPin} label="Adres" value={patient?.adres} />
            <InfoItem
              icon={Clock}
              label="Doğum Tarihi"
              value={dayjs(patient?.birthDate).format('DD/MM/YYYY')}
            />
          </div>
        </Card>

        {/* Sağlık Bilgileri */}
        <Card title="Sağlık Bilgileri" className="shadow-sm">
          <div className="space-y-4">
            <InfoItem icon={Heart} label="Kan Grubu" value={patient?.kanGrubu} />
            <InfoItem 
              icon={AlertTriangle} 
              label="Alerjiler" 
              value={patient?.allergies || "Belirtilmemiş"} 
            />
            <InfoItem 
              icon={Clock} 
              label="Son Muayene" 
              value={patient?.lastCheckup || "Belirtilmemiş"} 
            />
          </div>
        </Card>

        {/* Mobilde görünecek Profili Düzenle butonu */}
        {isMobile && (
          <div className="flex justify-center">
            <Button
              type="primary"
              onClick={handleEdit}
              className="
                bg-blue-600 
                w-[200px]
                h-12 
                text-base 
                font-medium 
                shadow-sm 
                hover:bg-blue-700 
                hover:shadow
                transition-all 
                duration-200
                flex 
                items-center 
                justify-center 
                gap-2
              "
            >
              <Edit className="w-4 h-4" />
              <span>Profili Düzenle</span>
            </Button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalVisible && (
        <Modal
          title="Profil Bilgilerini Düzenle"
          open={isEditModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={700}
          destroyOnClose={true}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            className="mt-4"
            preserve={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="telefon"
                label="Telefon"
                rules={[{ required: true, message: 'Telefon gereklidir' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="adres"
                label="Adres"
                rules={[{ required: true, message: 'Adres gereklidir' }]}
              >
                <Input.TextArea />
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
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={handleCancel}>
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

export default PatientProfile;