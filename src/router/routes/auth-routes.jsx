import React from 'react'
import AuthLayout from '../../layouts/AuthLayout'
import Login from '../../pages/auth/Login'
import Register from '../../pages/auth/Register'
import store from '../../redux/store.jsx';
import { logout } from '../../redux/slices/auth-slice.js';
import { removeFromLocalStorage } from '../../helpers/functions/encrypted-storage.js';

const AuthRoutes = 
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
        action: async () => {
          store.dispatch(logout());
          removeFromLocalStorage('token');
          return null;
        }
      },
      {
        path: "register",
        element: <Register />,
      }
    ],
  }


export default AuthRoutes