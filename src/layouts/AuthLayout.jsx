import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
    <Header/>

    <main className="flex-grow flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <Outlet />
      </div>
    </main>

    <Footer/>
  </div>
  )
}

export default AuthLayout