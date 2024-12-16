import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import LoadingPage from "../components/common/LoadingPage";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import MenuBar from "../components/common/menu-bar";

const UserLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(false);
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <>
      <Header />
      <div className="flex h-screen bg-white">
        <MenuBar />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white shadow rounded-lg">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserLayout;
