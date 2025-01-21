import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Form, Input, DatePicker, Modal, Select } from 'antd';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Edit } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import dayjs from 'dayjs';
import { getTechnicianById, updateTechnician } from '../../services/technicians-service';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import PropTypes from 'prop-types';

const TechnicianProfile = () => {
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const technicianId = useSelector(state => state.auth.user.id.toString());
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const fetchTechnicianProfile = async () => {
    try {
      setLoading(true);
      const response = await getTechnicianById(technicianId);
      setTechnician(response);
    } catch (error) {
      console.error('Profil bilgileri yüklenemedi:', error);
      message.error('Profil bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicianProfile();
  }, [technicianId]);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const updatedTechnician = await updateTechnician(technicianId, {
        ...values,
        username: values.username,
        ad: values.name,
        soyad: values.surname,
        telefon: values.phoneNumber,
        kanGrubu: values.kanGrubu,
        birthDate: values.birthDate.format('YYYY-MM-DD'),
      });
      setTechnician(updatedTechnician);
      setIsEditModalVisible(false);
      message.success('Profil başarıyla güncellendi.');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      message.error('Güncelleme başarısız oldu');
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

  if (loading || !technician) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Teknisyen Profili</h2>
        <Button
          type="primary"
          icon={<Edit className="w-4 h-4" />}
          onClick={() => {
            form.setFieldsValue({
              ...technician,
              username: technician.username,
              name: technician.ad,
              surname: technician.soyad,
              phoneNumber: technician.telefon,
              kanGrubu: technician.kanGrubu,
              birthDate: technician.birthDate ? dayjs(technician.birthDate) : null,
            });
            setIsEditModalVisible(true);
          }}
          className="bg-blue-600"
        >
          {isMobile ? "Düzenle" : "Profili Düzenle"}
        </Button>
      </div>

      {/* Ana Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kişisel Bilgiler */}
        <Card title="Kişisel Bilgiler" className="shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar size={64} icon={<User />} className="bg-blue-100 text-blue-600" />
              <div>
                <h3 className="text-lg font-medium">
                  {technician.ad} {technician.soyad}
                </h3>
                <p className="text-gray-500">{technician.username}</p>
              </div>
            </div>
            <InfoItem icon={Mail} label="E-posta" value={technician.email} />
            <InfoItem icon={Phone} label="Telefon" value={technician.telefon} />
            <InfoItem 
              icon={Briefcase} 
              label="Departman" 
              value={technician.department || "Belirtilmemiş"} 
            />
            <InfoItem 
              icon={GraduationCap} 
              label="Uzmanlık" 
              value={technician.specialization || "Belirtilmemiş"} 
            />
          </div>
        </Card>

        {/* Diğer Bilgiler */}
        <Card title="Detaylı Bilgiler" className="shadow-sm">
          <div className="space-y-4">
            <InfoItem icon={MapPin} label="Adres" value={technician.adres || "Belirtilmemiş"} />
            <InfoItem 
              icon={User} 
              label="TC Kimlik" 
              value={technician.tcKimlik || "Belirtilmemiş"} 
            />
            <InfoItem 
              icon={User} 
              label="Kan Grubu" 
              value={technician.kanGrubu || "Belirtilmemiş"} 
            />
            {technician.birthDate && (
              <InfoItem 
                icon={User} 
                label="Doğum Tarihi" 
                value={dayjs(technician.birthDate).format('DD/MM/YYYY')} 
              />
            )}
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Profil Bilgilerini Düzenle"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
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
              name="username"
              label="Kullanıcı Adı"
              rules={[{ required: true, message: 'Kullanıcı adı gereklidir' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="name"
              label="Ad"
              rules={[{ required: true, message: 'Ad gereklidir' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="surname"
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
              name="phoneNumber"
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
              name="birthDate"
              label="Doğum Tarihi"
              rules={[{ required: true, message: 'Doğum tarihi gereklidir' }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="adres"
              label="Adres"
              rules={[{ required: true, message: 'Adres gereklidir' }]}
            >
              <Input.TextArea />
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
    </div>
  );
};

export default TechnicianProfile;