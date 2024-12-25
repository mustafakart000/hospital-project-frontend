import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { config } from "../helpers/config/index.js";
import UserLayout from "../layouts/UserLayout.jsx";
import HomePage from "../pages/HomePage.jsx";

import PrivateRoute from "./private-route.jsx";
import AuthRoutes from "./routes/auth-routes.jsx";

import DoctorPanel from "../components/doctor/DoctorPanel.jsx";
import { removeFromLocalStorage } from "../helpers/functions/encrypted-storage.js";
import PatientPanelPage from "../pages/dashboards/patientPage/PatientPanelPage.jsx";
import Error401Page from "../pages/errors/error-401.jsx";
import Error404Page from "../pages/errors/error-404.jsx";
import { logout } from "../redux/slices/auth-slice.js";
import store from "../redux/store.jsx";
import AdminRoutes from "./routes/admin-routes.jsx";

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
      ...AdminRoutes,    
    ],
    
  },
  {path: "/patient-dashboard",
    
    element: (
      <PrivateRoute roles={config.pageRoles.patientManagement}>
        <PatientPanelPage/>
      </PrivateRoute>
    )
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
