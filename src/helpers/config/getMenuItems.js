export const getMenuItems = (role) => {
  const menus = {
    ADMIN: [
      { title: "Admin Management", link: "/dashboard/admin-management" },
      { title: "Doctor Management", link: "/dashboard/doctor-management" },
      { title: "Patient Management", link: "/dashboard/patient-management" },
      { title: "Doctor Edit", link: "/dashboard/doctor-management/edit" },
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