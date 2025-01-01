import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { config } from "../helpers/config/index.js";
import UserLayout from "../layouts/UserLayout.jsx";
import HomePage from "../pages/HomePage.jsx";

import PrivateRoute from "./private-route.jsx";
import AuthRoutes from "./routes/auth-routes.jsx";

import { removeFromLocalStorage } from "../helpers/functions/encrypted-storage.js";
import PatientPanelPage from "../pages/dashboards/patientPage/PatientPanelPage.jsx";
import Error401Page from "../pages/errors/error-401.jsx";
import Error404Page from "../pages/errors/error-404.jsx";
import { logout } from "../redux/slices/auth-slice.js";
import store from "../redux/store.jsx";

import PatientAppointments from "../components/patient/PatientAppointments.jsx";
import PatientPrescriptions from "../components/patient/PatientPrescriptions.jsx";
import PatientMedicalHistory from "../components/patient/PatientMedicalHistory.jsx";
import PatientProfile from "../components/patient/PatientProfile.jsx";
import AdminRoutes from "./routes/admin-routes.jsx";
import DoctorProfile from "../components/doctor/DoctorProfile.jsx";
import DoctorPatients from "../components/doctor/DoctorPatients.jsx";
import DoctorPrescriptions from "../components/doctor/DoctorPrescriptions.jsx";
import DoctorAppointments from "../components/doctor/DoctorAppointments.jsx";
import TreatmentPanel from "../components/doctor/hasta paneli/TreatmentPanel.jsx";
import DoctorDashboard from "../pages/dashboards/DoctorDashboardPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    action: async () => {
      store.dispatch(logout());
      removeFromLocalStorage("token");
      return null;
    },
  },
  AuthRoutes,
  {
    path: "/dashboard",
    element: (
      <PrivateRoute roles={config.pageRoles.dashboard}>
        <UserLayout />
      </PrivateRoute>
    ),
    children: [...AdminRoutes],
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
  {
    path: "/doctor-dashboard",
    element: (
      <PrivateRoute roles={config.pageRoles.doctorManagement}>
        <UserLayout />
      </PrivateRoute>
    ),

    children: [
      {
        path: "",
        element: (
          <PrivateRoute roles={config.pageRoles.doctorManagement}>
            <DoctorDashboard/>
          </PrivateRoute>
        ),
      },

      {
        path: "/doctor-dashboard/doctor-appointments",
        element: (
          <PrivateRoute roles={config.pageRoles.doctorManagement}>
            <DoctorAppointments />
          </PrivateRoute>
        ),
      },

      {
        path: "/doctor-dashboard/doctor-prescriptions",

        element: (
          <PrivateRoute roles={config.pageRoles.doctorManagement}>
            <DoctorPrescriptions />
          </PrivateRoute>
        ),
      },
      {
        path: "/doctor-dashboard/doctor-patients",
        element: (
          <PrivateRoute roles={config.pageRoles.doctorManagement}>
            <DoctorPatients />
          </PrivateRoute>
        ),
      },
      {
        path: "/doctor-dashboard/doctor-profile",
        element: (
          <PrivateRoute roles={config.pageRoles.doctorManagement}>
            <DoctorProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/doctor-dashboard/doctor-treatment",
        element: (
          <PrivateRoute roles={config.pageRoles.doctorManagement}>
            <TreatmentPanel />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Error404Page />,
  },
  {
    path: "unauthorized",
    element: <Error401Page />,
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
