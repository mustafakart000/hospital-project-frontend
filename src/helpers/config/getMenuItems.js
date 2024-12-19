export const getMenuItems = (role) => {
  const menus = {
    ADMIN: [
      { title: "Admin Management", link: "/dashboard/admin-management" },
      { title: "Doctor Management", link: "/dashboard/doctor-management" },
      { title: "Patient Management", link: "/dashboard/patient-management" },
      { title: "Doctor Edit", link: "/dashboard/doctor-management/edit" },
    ],
    DOCTOR: [
      { title: "Doctor Panel", link: "/dashboard/doctor-panel" },
      { title: "Appointments", link: "/dashboard/doctor-appointments" },
      { title: "Patients", link: "/dashboard/doctor-patients" },
      { title: "Prescriptions", link: "/dashboard/doctor-prescriptions" },
      { title: "Profile", link: "/dashboard/doctor-profile" },
    ],
    PATIENT: [
      { title: "Patient dashboard", link: "/patient-dashboard" },
    ],
  };

  return menus[role] || [];
};