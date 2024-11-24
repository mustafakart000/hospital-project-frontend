import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md relative">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-blue-600">Hastane Yönetim Sistemi</h1>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              <Link to="/auth/login" className="px-4 py-2 text-blue-600 hover:text-blue-800">
                Giriş Yap
              </Link>
              <Link to="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Kayıt Ol
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-white shadow-md`}>
            <div className="flex flex-col p-4 space-y-3">
              <Link to="/auth/login" className="px-4 py-2 text-blue-600 hover:text-blue-800 text-center">
                Giriş Yap
              </Link>
              <Link to="/auth/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">
                Kayıt Ol
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-50 py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Modern Sağlık Yönetim Sistemi
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Hastane süreçlerinizi dijitalleştirin, verimliliğinizi artırın
            </p>
            <Link to="/auth/register" className="inline-block bg-blue-600 text-white px-6 md:px-8 py-3 rounded-md text-base md:text-lg hover:bg-blue-700">
              Hemen Başlayın
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
              Özelliklerimiz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl md:text-4xl text-blue-600 mb-4">🏥</div>
                <h4 className="text-lg md:text-xl font-semibold mb-2">Randevu Yönetimi</h4>
                <p className="text-gray-600">Online randevu alma ve yönetim sistemi</p>
              </div>
              <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl md:text-4xl text-blue-600 mb-4">👨‍⚕️</div>
                <h4 className="text-lg md:text-xl font-semibold mb-2">Doktor Portalı</h4>
                <p className="text-gray-600">Doktorlar için özel yönetim paneli</p>
              </div>
              <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl md:text-4xl text-blue-600 mb-4">📊</div>
                <h4 className="text-lg md:text-xl font-semibold mb-2">Raporlama</h4>
                <p className="text-gray-600">Detaylı analiz ve raporlama araçları</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm md:text-base">&copy; 2024 Hastane Yönetim Sistemi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;  