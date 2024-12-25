export const getMenuItems = (role) => {
  const menus = {
    ADMIN: [
      { title: "Ana Sayfa", link: "/dashboard" },
      { title: "Admin Yönetimi", link: "/dashboard/admin-management" },
      { title: "Doktor Yönetimi", link: "/dashboard/doctor-management" },
      { title: "Hasta Yönetimi", link: "/dashboard/patient-management" },
      
      
    ],
    DOCTOR: [
      { title: "Ana Sayfa", link: "/doctor-dashboard" },
      { title: "Doktor Düzenle", link: "/doctor-dashboard/doctor-management/edit" },
      { title: "Doktor Profili", link: "/doctor-dashboard/doctor-management-profile" },
      { title: "Randevu Yönetimi", link: "/doctor-dashboard/doctor-management-appointments" },
      { title: "Hasta Yönetimi", link: "/doctor-dashboard/doctor-management-patients" },
      
    ],
    PATIENT: [
      { title: "Ana Sayfa", link: "/patient-dashboard" },
      { title: "Randevu Yönetimi", link: "/patient-dashboard/patient-appointments" },
      { title: "Reçete Yönetimi", link: "/patient-dashboard/patient-prescriptions" },
      { title: "Hasta Geçmişi", link: "/patient-dashboard/patient-medical-history" },
      { title: "Hasta Profili", link: "/patient-dashboard/patient-profile" },
    ],
  };

  return menus[role] || [];
};