import React from 'react';
import { Card } from 'antd';
import { Calendar, Clock, User, FileText } from 'lucide-react';

const PatientPanelPage = () => {
  // Örnek kullanıcı bilgileri - API'den gelecek
  const userInfo = {
    name: 'Ayşe Kara',
    tcNo: '78943222350',
    email: 'ayse.kara1@ornek.com',
    phone: '+905554567890',
    address: 'Nilüfer, Bursa, Türkiye',
    bloodType: '0+',
    birthDate: '1990-05-15'
  };

  // İstatistikler
  const stats = [
    {
      title: 'Toplam Randevu',
      value: '12',
      icon: <Calendar className="h-6 w-6 text-white" />,
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Yaklaşan Randevu',
      value: '2',
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
                <p className="font-medium">{userInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">TC Kimlik</p>
                <p className="font-medium">{userInfo.tcNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{userInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Adres</p>
                <p className="font-medium">{userInfo.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kan Grubu</p>
                <p className="font-medium">{userInfo.bloodType}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Status Summary */}
        <div>
          <Card title="Randevu Özeti" className="mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Yaklaşan Randevu</span>
                <span className="text-blue-600 font-medium">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tamamlanan</span>
                <span className="text-green-600 font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span>İptal Edilen</span>
                <span className="text-red-600 font-medium">0</span>
              </div>
            </div>
          </Card>
          
          <Card title="Tıbbi Geçmiş">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Son Muayene</span>
                <span className="text-gray-600">15.12.2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Son Tahlil</span>
                <span className="text-gray-600">10.12.2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Son Reçete</span>
                <span className="text-gray-600">15.12.2024</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientPanelPage;