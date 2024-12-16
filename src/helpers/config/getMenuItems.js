export const getMenuItems = (role) => {
  const menus = {
    ADMIN: [
      { title: "Admin Management", link: "/dashboard/admin/management" },
      { title: "Doctor Management", link: "/dashboard/doctor/management" },
      { title: "Patient Management", link: "/dashboard/patient/management" },
      { title: "Doctor Edit", link: "/dashboard/doctor-management/edit" },
    ],
    DOCTOR: [
      { title: "Appointments", link: "/dashboard/appointments" },
      { title: "Patients", link: "/dashboard/patients" },
    ],
    PATIENT: [
      { title: "Profile", link: "/dashboard/profile" },
    ],
  };

  return menus[role] || [];
};