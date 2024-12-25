import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { config } from "../helpers/config/index.js";
import UserLayout from "../layouts/UserLayout.jsx";
import HomePage from "../pages/HomePage.jsx";

import PrivateRoute from "./private-route.jsx";
import AuthRoutes from "./routes/auth-routes.jsx";

import AdminDashboardPage from "../pages/dashboards/AdminDashboardPage.jsx";
import DoctorManagement from "../components/admin/DoctorManagement.jsx";
import Error404Page from "../pages/errors/error-404.jsx";
import Error401Page from "../pages/errors/error-401.jsx";
import DoctorEdit from "../components/admin/doctor-edit.jsx";
import DoctorRegistration from "../components/admin/DoctorRegistration.jsx";
import AdminMainDashboard from "../components/admin/admin-main-dashboard.jsx";
import PatientManagementPage from "../pages/dashboards/PatientManagementPage.jsx";
import PatientPanelPage from "../pages/dashboards/patientPage/PatientPanelPage.jsx";
import DoctorPanel from "../components/doctor/DoctorPanel.jsx";
import { logout } from "../redux/slices/auth-slice.js";
import { removeFromLocalStorage } from "../helpers/functions/encrypted-storage.js";
import store from "../redux/store.jsx";
import PatientAppointments from "../components/patient/PatientAppointments.jsx";
import PatientPrescriptions from "../components/patient/PatientPrescriptions.jsx";
import PatientMedicalHistory from "../components/patient/PatientMedicalHistory.jsx";
import PatientProfile from "../components/patient/PatientProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    action: async () => {
      store.dispatch(logout());
      removeFromLocalStorage('token');
      return null;
    }
  },
  AuthRoutes,
  {
    path: "/dashboard",
    element: (
      <PrivateRoute roles={config.pageRoles.dashboard}>
        <UserLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <PrivateRoute roles={config.pageRoles.dashboard}>
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
      
    ],
    
  },
  {
    path: "/patient-dashboard",
    element: (
      <PrivateRoute roles={config.pageRoles.patientManagement}>
        <UserLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <PrivateRoute roles={config.pageRoles.patientManagement}>
            <PatientPanelPage />
          </PrivateRoute>
        ),
      },
      
      {
        path: "patient-appointments",
        element: (
          <PrivateRoute roles={config.pageRoles.patientManagement}>
            <PatientAppointments />
          </PrivateRoute>
        ),
      },
      {
        path: "patient-prescriptions",
        element: (
          <PrivateRoute roles={config.pageRoles.patientManagement}>
            <PatientPrescriptions />
          </PrivateRoute>
        ),
      },
      {
        path: "patient-medical-history",
        element: (
          <PrivateRoute roles={config.pageRoles.patientManagement}>
            <PatientMedicalHistory />
          </PrivateRoute>
        ),
      },
      {
        path: "patient-profile",
        element: (
          <PrivateRoute roles={config.pageRoles.patientManagement}>
            <PatientProfile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {path: "/dashboard/doctor-dashboard",
    
    element: (
      <PrivateRoute roles={config.pageRoles.doctorManagement}>
        <DoctorPanel/>
      </PrivateRoute>
    )
  },
  {
    path: '*',
    element: <Error404Page/>,
  },
  {
    path: "unauthorized",
    element: <Error401Page/>
  },
  
]);

const AppRouter = () => {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      }}
    />
  );
};

export default AppRouter;
