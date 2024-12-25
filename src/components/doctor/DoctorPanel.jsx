import React, { useState } from "react";
import { Card } from 'antd';
import { Calendar, Users, FileText, Plus, ClipboardList } from "lucide-react";
import CreateReservationForm from "../patient/CreateReservationForm";

const DoctorPanel = () => {
  const [isFormVisible, setFormVisible] = useState(false);

  // İstatistikler
  const stats = [
    {
      title: 'Toplam Randevu',
      value: '128',
      icon: <Calendar className="h-6 w-6 text-white" />,
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Bugünkü Randevular',
      value: '12',
      icon: <ClipboardList className="h-6 w-6 text-white" />,
      bgColor: 'bg-green-500'
    },
    {
      title: 'Toplam Hasta',
      value: '84',
      icon: <Users className="h-6 w-6 text-white" />,
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Aktif Reçeteler',
      value: '6',
      icon: <FileText className="h-6 w-6 text-white" />,
      bgColor: 'bg-rose-500'
    }
  ];

  // Örnek doktor bilgileri - API'den gelecek
  const doctorInfo = {
    name: 'Dr. Ahmet Yılmaz',
    specialty: 'Kardiyoloji Uzmanı',
    email: 'dr.ahmet@example.com',
    phone: '+905554567890',
    address: 'Merkez Hastanesi, Nilüfer/Bursa',
    licenseNo: 'DR123456',
    experience: '15 yıl',
    department: 'Kardiyoloji'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doktor Portalı</h1>
          <p className="text-gray-500">Randevularınızı ve hastalarınızı yönetin</p>
        </div>
        <button 
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 gap-2"
          onClick={() => setFormVisible(true)}
        >
          <Plus className="w-5 h-5" />
          Yeni Randevu Oluştur
        </button>
      </div>

      {/* CreateReservationForm bileşeni */}
      <CreateReservationForm 
        visible={isFormVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={(data) => {
          console.log('Form verileri:', data);
          setFormVisible(false);
        }}
      />

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
        {/* Doctor Info */}
        <div className="lg:col-span-2">
          <Card title="Doktor Bilgileri" className="h-full">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ad Soyad</p>
                <p className="font-medium">{doctorInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Uzmanlık</p>
                <p className="font-medium">{doctorInfo.specialty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{doctorInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{doctorInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Adres</p>
                <p className="font-medium">{doctorInfo.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lisans No</p>
                <p className="font-medium">{doctorInfo.licenseNo}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="space-y-6">
          <Card title="Bugünkü Randevular" className="mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Bekleyen</span>
                <span className="text-blue-600 font-medium">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tamamlanan</span>
                <span className="text-green-600 font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span>İptal Edilen</span>
                <span className="text-red-600 font-medium">1</span>
              </div>
            </div>
          </Card>
          
          <Card title="Departman İstatistikleri">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Haftalık Randevu</span>
                <span className="text-gray-600">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Aylık Randevu</span>
                <span className="text-gray-600">180</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Aktif Hasta</span>
                <span className="text-gray-600">84</span>
              </div>
            </div>
          </Card>

          <Card title="Hızlı Erişim">
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Randevu Takvimi</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <span>Hasta Listesi</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Reçeteler</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorPanel;
