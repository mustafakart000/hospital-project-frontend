import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestLayout = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold text-center">Hastane Yönetim Sistemi</h1>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <Outlet />
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Hastane Yönetim Sistemi</p>
      </footer>
    </div>
  );
};

export default GuestLayout; 