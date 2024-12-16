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
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
        <PatientPanelPage/>
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <PatientPanelPage/>,
      },
    ]
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
        v7_startTransition: true, // Transition'ları optimize etmek
        v7_relativeSplatPath: true, // Daha iyi path eşlemesi
        v7_fetcherPersist: true, // Fetcher'ların kalıcılık davranışı
        v7_normalizeFormMethod: true, // Form metodunun normalize edilmesi
        v7_partialHydration: true, // Kısmi hidrasyon davranışı
        v7_skipActionErrorRevalidation: true, // 4xx/5xx revalidation davranışı
      }}
    />
  );
};

export default AppRouter;
