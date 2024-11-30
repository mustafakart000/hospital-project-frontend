import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "../layouts/UserLayout.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import GuestLayout from "../layouts/GuestLayout.jsx";
import LandingPage from "../pages/LandingPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/auth",
    element: <GuestLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      
    ],
  },
  {
    path: "/dashboard",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
