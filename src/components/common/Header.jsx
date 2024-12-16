import React from 'react';
import { Hospital } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-700 to-gray-700 text-white py-4 md:py-5 shadow-lg relative overflow-hidden">
      {/* Background pattern layer */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Hospital className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
            <h1 className="text-lg md:text-xl font-semibold tracking-wide text-center">
              Hastane Yönetim Sistemi
            </h1>
          </div>
          
          <div className="hidden md:block text-sm text-center text-gray-200 opacity-90 max-w-2xl px-4">
            Sağlık Hizmetlerinde Dijital Mükemmellik: Hızlı, Güvenli ve Entegre Yönetim Çözümü
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;