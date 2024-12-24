import React from "react";
import { Hospital } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogoutOutlined } from "@ant-design/icons";
import store from "../../redux/store.jsx";
import { logout } from "../../redux/slices/auth-slice.js";
import { removeFromLocalStorage } from "../../helpers/functions/encrypted-storage.js";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    store.dispatch(logout());
    removeFromLocalStorage("token");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-gray-700 text-white py-3 sm:py-4 md:py-5 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>

      <div className="container mx-auto px-2 sm:px-4 relative z-10">
        <div className="flex flex-col items-center relative">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <Hospital 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" 
              strokeWidth={1.5}
            />
            <h1 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide text-center">
              Hastane Yönetim Sistemi
            </h1>
          </div>

          <div className="hidden md:block text-xs sm:text-sm text-center text-gray-200 opacity-90 max-w-2xl px-4 mt-2">
            Sağlık Hizmetlerinde Dijital Mükemmellik: Hızlı, Güvenli ve Entegre Yönetim Çözümü
          </div>

          {user && (
            <div className="absolute right-0 top-0 sm:right-2 md:right-4 ">
              <div className="border border-white rounded-md p-1.5 sm:p-2">
                <Link to="/" onClick={handleLogout} className="flex items-center">
                  <span className="text-xs sm:text-sm font-semibold mr-1 sm:mr-2">
                    Çıkış yap
                  </span>
                  <LogoutOutlined className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;