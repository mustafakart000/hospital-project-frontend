import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { getPatientProfile } from '../../../services/patient-service';
import { useSelector } from 'react-redux';

const PatientPanelPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const patientId = useSelector(state => state.auth.user.id.toString());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPatientProfile(patientId);
        setUserInfo(response);
        setMedicalRecords(response.medicalRecords);
      } catch (error) {
        console.error('Hasta bilgileri yüklenirken hata oluştu:', error);
      }
    };
    fetchData();
  }, [patientId]);

  const stats = [
    {
      title: 'Toplam Randevu',
      value: userInfo.reservations ? userInfo.reservations.filter(r => r.status !== 'CANCELLED').length : 0,
      icon: <Calendar className="h-6 w-6 text-white" />, 
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Yaklaşan Randevu',
      value: userInfo.reservations ? userInfo.reservations.filter(r => new Date(r.date) > new Date()).length : 0,
      icon: <Clock className="h-6 w-6 text-white" />, 
      bgColor: 'bg-green-500'
    },
    {
      title: 'Aktif Reçete',
      value: '3',
      icon: <FileText className="h-6 w-6 text-white" />, 
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Sağlık Durumu',
      value: 'İyi',
      icon: <User className="h-6 w-6 text-white" />, 
      bgColor: 'bg-rose-500'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hasta Portalı</h1>
          <p className="text-gray-500">Randevularınızı yönetin, sağlık geçmişinizi takip edin</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="lg:col-span-2">
          <Card title="Kişisel Bilgiler" className="h-full">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ad</p>
                <p className="font-medium">{userInfo.ad} {userInfo.soyad}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">TC Kimlik</p>
                <p className="font-medium">{userInfo.tcKimlik}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{userInfo.telefon}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Adres</p>
                <p className="font-medium">{userInfo.adres}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kan Grubu</p>
                <p className="font-medium">{userInfo.kanGrubu}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Medical Records */}
        <div>
          <Card title="Tıbbi Geçmiş">
            <div className="space-y-4">
              {medicalRecords.map(record => (
                <div key={record.id} className="flex justify-between items-center">
                  <span>{record.title}</span>
                  <span className="text-gray-600">{record.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientPanelPage;