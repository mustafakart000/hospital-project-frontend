import React, { useState, useEffect } from "react";
import { Card } from 'antd';
import { Calendar, Users, FileText, ClipboardList } from "lucide-react";
import { getDoctorById } from "../../services/doctor-service";
import { getDoctorReservations } from "../../services/reservation-service";
import { getPrescriptionsCurrentDoctor } from "../../services/prescription-service";
import { useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';

const DoctorPanel = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const doctorId = useSelector(state => state.auth.user.id.toString());
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ maxWidth: 1024 });

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await getDoctorById(doctorId);
        const reservations = await getDoctorReservations(doctorId);
        const prescriptionsData = await getPrescriptionsCurrentDoctor(doctorId);
        setPrescriptions(prescriptionsData);
        setDoctorInfo({ ...response, reservations });
      } catch (error) {
        console.error("Doktor bilgileri alınamadı:", error);
      }
    };

    fetchDoctorInfo();
  }, [doctorId]);

  if (!doctorInfo) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  const stats = [
    {
      title: 'Toplam Randevu',
      value: doctorInfo.reservations?.filter(r => r.status !== 'CANCELLED').length || 0,
      icon: <Calendar className="h-6 w-6 text-white" />,
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Bugünkü Randevular',
      value: doctorInfo.reservations?.filter(r => 
        r.reservationDate === new Date().toISOString().split('T')[0] && 
        r.status !== 'CANCELLED'
      ).length || 0,
      icon: <ClipboardList className="h-6 w-6 text-white" />,
      bgColor: 'bg-green-500'
    },
    {
      title: 'Toplam Hasta',
      value: doctorInfo.reservations ? 
        new Set(doctorInfo.reservations.map(r => r.patientId)).size : 0,
      icon: <Users className="h-6 w-6 text-white" />,
      bgColor: 'bg-purple-500'
    },
    {
      title: 'Aktif Reçeteler',
      value: prescriptions.reduce((total, prescription) => total + prescription.medications.length, 0),
      icon: <FileText className="h-6 w-6 text-white" />,
      bgColor: 'bg-rose-500'
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={`${isMobile ? 'space-y-2' : 'flex justify-between items-center'} mb-6`}>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Doktor Portalı</h1>
          <p className="text-sm md:text-base text-gray-500">Randevularınızı ve hastalarınızı yönetin</p>
        </div>
      </div>

      {/* Statistics */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : isTablet ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-6'}`}>
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'} gap-6`}>
        {/* Doctor Info */}
        <div className="lg:col-span-2">
          <Card title="Doktor Bilgileri" className="h-full">
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              <div>
                <p className="text-sm text-gray-500">Ad Soyad</p>
                <p className="font-medium">{doctorInfo.unvan} {doctorInfo.ad} {doctorInfo.soyad}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Uzmanlık</p>
                <p className="font-medium">{doctorInfo.speciality}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{doctorInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{doctorInfo.phone}</p>
              </div>
              <div className={isMobile ? '' : 'sm:col-span-2'}>
                <p className="text-sm text-gray-500">Adres</p>
                <p className="font-medium">{doctorInfo.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lisans No</p>
                <p className="font-medium">{doctorInfo.diplomaNo}</p>
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
                <span className="text-blue-600 font-medium">
                  {doctorInfo.reservations?.filter(r => r.status === 'PENDING').length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tamamlanan</span>
                <span className="text-green-600 font-medium">
                  {doctorInfo.reservations?.filter(r => r.status === 'COMPLETED').length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>İptal Edilen</span>
                <span className="text-red-600 font-medium">
                  {doctorInfo.reservations?.filter(r => r.status === 'CANCELLED').length || 0}
                </span>
              </div>
            </div>
          </Card>
          
          <Card title="Departman İstatistikleri">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Haftalık Randevu</span>
                <span className="text-gray-600">
                  {doctorInfo.reservations?.filter(r => 
                    new Date(r.reservationDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Aylık Randevu</span>
                <span className="text-gray-600">
                  {doctorInfo.reservations?.filter(r => 
                    new Date(r.reservationDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Aktif Hasta</span>
                <span className="text-gray-600">
                  {doctorInfo.reservations ? 
                    new Set(doctorInfo.reservations.map(r => r.patientId)).size : 0}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorPanel;
