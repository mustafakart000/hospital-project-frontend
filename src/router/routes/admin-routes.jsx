import React from "react";
import AdminMainDashboard from "../../components/admin/admin-main-dashboard";
import DoctorEdit from "../../components/admin/doctor-edit";
import DoctorManagement from "../../components/admin/DoctorManagement";
import AdminDashboardPage from "../../pages/dashboards/AdminDashboardPage";
import PatientManagementPage from "../../pages/dashboards/PatientManagementPage";
import PrivateRoute from "../private-route";
import { config } from "../../helpers/config";
import DoctorRegistration from "../../components/admin/DoctorRegistration";
import AdminEdit from "../../components/admin/admin-edit";
import PatientEdit from "../../components/admin/PatientEdit";
import TechnicianManagement from "../../components/admin/TechnicianManagement";
import TechnicianEdit from "../../components/admin/TechnicianEdit";

const  AdminRoutes = [
    {
        path: "",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <AdminMainDashboard />
          </PrivateRoute>
        ),
      },
      
      {
        path: "admin-management",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <AdminDashboardPage />
          </PrivateRoute>
        ),
      },
      {
        path: "doctor-management",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <DoctorManagement/>
          </PrivateRoute>
        ),
      },
      {
        path: "technician-management",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <TechnicianManagement/>
          </PrivateRoute>
        ),
      },
      {
        path: "technician-management/edit/:id",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <TechnicianEdit/>
          </PrivateRoute>
        ),
      },
     

      {
        path: "doctor-management/register",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <DoctorRegistration/>
          </PrivateRoute>
        ),
      },
      {
        path: "doctor-management/edit/:id",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <DoctorEdit/>
          </PrivateRoute>
        ),
      },
      {
        path: "patient-management",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <PatientManagementPage/>
          </PrivateRoute>
        ),
      },
      {
        path: "patient-management/edit/:id",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <PatientEdit/>
          </PrivateRoute>
        ),
      },
      {
        path: "admin-management/edit/:id",
        element: (
          <PrivateRoute roles={config.pageRoles.adminManagement}>
            <AdminEdit/>
          </PrivateRoute>
        ),
      }
];


export default AdminRoutes;
