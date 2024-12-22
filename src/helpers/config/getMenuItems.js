export const getMenuItems = (role) => {
  const menus = {
    ADMIN: [
      { title: "Ana Sayfa", link: "/dashboard" },
      { title: "Admin Yönetimi", link: "/dashboard/admin-management" },
      { title: "Doktor Yönetimi", link: "/dashboard/doctor-management" },
      { title: "Hasta Yönetimi", link: "/dashboard/patient-management" },
      
    ],
    DOCTOR: [
      { title: "Doctor Management", link: "/dashboard/doctor-dashboard" },
      { title: "Doctor Edit", link: "/dashboard/doctor-management/edit" },
      { title: "Profile", link: "/dashboard/doctor-management-profile" },
      { title: "Appointments", link: "/dashboard/doctor-management-appointments" },
      { title: "Patients", link: "/dashboard/doctor-management-patients" },
      
    ],
    PATIENT: [
      { title: "Patient dashboard", link: "/patient-dashboard" },
    ],
  };

  return menus[role] || [];
};