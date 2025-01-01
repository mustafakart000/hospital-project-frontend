import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Form, Input, DatePicker, Select, Modal } from 'antd';
import { User, Mail, Phone, MapPin, Heart, AlertTriangle, Clock, Edit } from 'lucide-react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { getPatientProfile, updatePatientProfile } from '../../services/patient-service';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const patientId = useSelector(state => state.auth.user.id.toString());


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

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      await updatePatientProfile(patientId, {
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
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Profil Bilgilerim</h2>
        <Button
          type="primary"
          icon={<Edit className="w-4 h-4" />}
          onClick={() => {
            form.setFieldsValue({
              ...patient,
              birthDate: dayjs(patient.birthDate, 'YYYY-MM-DD'),
            });
            setIsEditModalVisible(true);
          }}
          className="bg-blue-600"
        >
          Profili Düzenle
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kişisel Bilgiler */}
        <Card title="Kişisel Bilgiler" className="shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 mb-6">
              <Avatar size={64} icon={<User />} className="bg-blue-100 text-blue-600 mb-4 md:mb-0" />
              <div>
                <h3 className="text-lg font-medium text-center md:text-left">{`${patient.ad} ${patient.soyad}`}</h3>
              </div>
            </div>
            <InfoItem icon={Mail} label="E-posta" value={patient.email} />
            <InfoItem icon={Phone} label="Telefon" value={patient.telefon} />
            <InfoItem icon={MapPin} label="Adres" value={patient.adres} />
            <InfoItem
              icon={Clock}
              label="Doğum Tarihi"
              value={dayjs(patient.birthDate).format('DD/MM/YYYY')}
            />
          </div>
        </Card>

        {/* Sağlık Bilgileri */}
        <Card title="Sağlık Bilgileri" className="shadow-sm">
          <div className="space-y-4">
            <InfoItem icon={Heart} label="Kan Grubu" value={patient.kanGrubu} />
            <InfoItem icon={AlertTriangle} label="Alerjiler" value={patient.allergies || "Belirtilmemiş"} />
            <InfoItem icon={Clock} label="Son Muayene" value={patient.lastCheckup || "Belirtilmemiş"} />
            <InfoItem icon={Clock} label="Tıbbi Geçmiş" value={patient.medicalHistory || "Belirtilmemiş"} />
          </div>
        </Card>

        {/* Tıbbi Kayıtlar */}
        <Card title="Tıbbi Kayıtlar" className="shadow-sm">
          <div className="space-y-4">
            {patient.medicalRecords.map(record => (
              <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">{record.title}</h4>
                <p className="text-sm text-gray-600">{record.description}</p>
                <p className="text-sm text-gray-600">Doktor Notları: {record.doctorNotes}</p>
                <p className="text-sm text-gray-600">Ek Bilgi: {record.additionalInfo}</p>
                <div className="flex space-x-2 mt-2">
                  {record.attachments && Object.entries(JSON.parse(record.attachments)).map(([key, url]) => (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      {key.toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Özet Bilgiler */}
        <Card title="Özet" className="shadow-sm">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">Yaklaşan Randevu</h4>
              <p className="text-sm text-blue-600">
                {patient.reservations.length > 0 ? `${dayjs(patient.reservations[0].reservationDate).format('DD/MM/YYYY')} - ${patient.reservations[0].reservationTime}` : "Planlanmış randevu bulunmuyor"}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">Aktif Reçete</h4>
              <p className="text-sm text-green-600">
                {patient.activePrescription || "Aktif reçete bulunmuyor"}
              </p>
            </div>
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

PatientProfile.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default PatientProfile;