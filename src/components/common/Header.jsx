import React from "react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogoutOutlined } from "@ant-design/icons";
import { useMediaQuery } from 'react-responsive';
import store from "../../redux/store.jsx";
import { logout } from "../../redux/slices/auth-slice.js";
import { removeFromLocalStorage } from "../../helpers/functions/encrypted-storage.js";
import { HeartPulse} from 'react-bootstrap-icons';


const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const isExtraSmall = useMediaQuery({ maxWidth: 430 });

  const handleLogout = () => {
    store.dispatch(logout());
    removeFromLocalStorage("token");
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-gray-700 text-white py-3 sm:py-4 md:py-5 shadow-lg relative overflow-hidden">
      <div className="flex justify-center w-full px-8 sm:px-12 md:px-16 relative z-10">
        <div className="flex flex-col items-center relative">
          <div className={`flex items-center justify-center ${isExtraSmall ? 'space-x-0' : 'space-x-2 sm:space-x-3'}`}>
            <HeartPulse    
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" 
              strokeWidth={1.5}
            />
            {!isExtraSmall && (
              <h1 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide text-center">
                Hastane Yönetim Sistemi
              </h1>
            )}
          </div>

          <div className="hidden lg:block text-xs sm:text-sm text-center text-gray-200 opacity-90 max-w-2xl px-4 mt-2">
            Sağlık Hizmetlerinde Dijital Mükemmellik: Hızlı, Güvenli ve Entegre Yönetim Çözümü
          </div>
        </div>
      </div>

      {user && (
        <div className={`absolute right-8 sm:right-12 md:right-16 ${
          isExtraSmall ? 'top-1/2 -translate-y-1/2' : 
          'top-1/2 -translate-y-1/2'} z-20`}>
          <Link 
            to="/" 
            onClick={handleLogout} 
            className="block hover:bg-white/20 transition-colors duration-200"
          >
            <div className="border border-white rounded-md p-1.5 sm:p-2 flex items-center space-x-1">
              <span className={`text-xs sm:text-sm font-semibold ${isExtraSmall ? 'hidden' : ''}`}>
                Çıkış yap
              </span>
              <LogoutOutlined className="text-lg" />
            </div>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;