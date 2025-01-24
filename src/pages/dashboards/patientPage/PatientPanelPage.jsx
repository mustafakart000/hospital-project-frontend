import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Calendar, User, FileText, Clock } from 'lucide-react';
import { getPatientProfile } from '../../../services/patient-service';
import { getPrescriptionsCurrentPatient } from '../../../services/prescription-service';
import { getReservationsByPatientId } from '../../../services/reservation-service';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
import 'moment/locale/tr';

moment.locale('tr');

const PatientPanelPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [reservations, setReservations] = useState([]);
  const patientId = useSelector(state => state.auth.user.id.toString());
  
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMediumScreen = useMediaQuery({ minWidth: 1024, maxWidth: 1466 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPatientProfile(patientId);
        const prescriptionsData = await getPrescriptionsCurrentPatient();
        const reservationsData = await getReservationsByPatientId(patientId);
        setPrescriptions(prescriptionsData);
        setReservations(reservationsData);
        setUserInfo(response);
      } catch (error) {
        console.error('Hasta bilgileri yüklenirken hata oluştu:', error);
      }
    };
    fetchData();
  }, [patientId]);

  const calculatePrescriptionStatus = (prescription) => {
    const now = moment();
    const allMedicationsExpired = prescription.medications?.every(med => 
      moment(med.endDate).isBefore(now)
    );
    
    if (allMedicationsExpired) {
      return 'EXPIRED';
    }
    
    const allMedicationsCompleted = prescription.medications?.every(med => 
      moment(med.endDate).isBefore(now)
    );
    
    if (allMedicationsCompleted) {
      return 'COMPLETED';
    }
    
    return 'ACTIVE';
  };

  const activePresCount = prescriptions.filter(prescription => 
    calculatePrescriptionStatus(prescription) === 'ACTIVE'
  ).length;

  const getNextAppointment = () => {
    const now = moment();

    // Onaylanmış randevuları filtrele
    const confirmedAppointments = reservations
      .filter(r => {
        const appointmentTime = moment(`${r.reservationDate} ${r.reservationTime}`, 'YYYY-MM-DD HH:mm:ss');
        return r.status === 'CONFIRMED' && 
               appointmentTime.isAfter(now);
      })
      .sort((a, b) => {
        const dateA = moment(`${a.reservationDate} ${a.reservationTime}`, 'YYYY-MM-DD HH:mm:ss');
        const dateB = moment(`${b.reservationDate} ${b.reservationTime}`, 'YYYY-MM-DD HH:mm:ss');
        return dateA.valueOf() - dateB.valueOf();
      });

    if (confirmedAppointments.length > 0) {
      const nextAppointment = confirmedAppointments[0];
      const appointmentTime = moment(`${nextAppointment.reservationDate} ${nextAppointment.reservationTime}`, 'YYYY-MM-DD HH:mm:ss');
      
      if (appointmentTime.isSame(now, 'day')) {
        return `Bugün: ${appointmentTime.format('HH:mm')}`;
      } else {
        return appointmentTime.format('DD.MM.YYYY HH:mm');
      }
    }

    return 'Randevu Yok';
  };

  const stats = [
    {
      title: 'Toplam Randevu',
      value: userInfo.reservations ? userInfo.reservations.filter(r => r.status !== 'CANCELLED').length : 0,
      icon: <Calendar className="h-6 w-6 text-white" />, 
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Yaklaşan Randevu',
      value: getNextAppointment(),
      icon: <Clock className="h-6 w-6 text-white" />, 
      bgColor: 'bg-green-500'
    },
    {
      title: 'Aktif Reçete',
      value: activePresCount,
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

  const renderUserInfoGrid = () => {
    const gridClass = isMobile 
      ? 'grid-cols-1 gap-4' 
      : isTablet 
      ? 'grid-cols-2 gap-6'
      : isMediumScreen
      ? 'grid-cols-2 gap-6'
      : 'grid-cols-3 gap-8';

    return (
      <div className={`grid ${gridClass}`}>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Ad</p>
          <p className="font-medium">{userInfo.ad} {userInfo.soyad}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">TC Kimlik</p>
          <p className="font-medium">{userInfo.tcKimlik}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{userInfo.email}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Telefon</p>
          <p className="font-medium">{userInfo.telefon}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Adres</p>
          <p className="font-medium">{userInfo.adres}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Kan Grubu</p>
          <p className="font-medium">{userInfo.kanGrubu}</p>
        </div>
      </div>
    );
  };

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
      <div className={`grid gap-6 ${
        isMobile 
          ? 'grid-cols-1' 
          : isTablet || isMediumScreen
          ? 'grid-cols-2'
          : 'grid-cols-4'
      }`}>
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className={`font-bold text-gray-800 ${stat.title === 'Yaklaşan Randevu' ? 'text-lg' : 'text-2xl'}`}>{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* User Info */}
        <Card title="Kişisel Bilgiler" className="h-full">
          {renderUserInfoGrid()}
        </Card>
      </div>
    </div>
  );
};

export default PatientPanelPage;