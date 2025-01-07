import React from 'react';
import { useMediaQuery } from 'react-responsive';

const MedicationsTab = () => {
  const isTablet = useMediaQuery({ maxWidth: 1200 });
  const isMobile = useMediaQuery({ maxWidth: 500 });

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="p-4 border rounded">
        <div className={`flex ${isTablet ? 'flex-col space-y-3' : 'items-center justify-between'} mb-4`}>
          <h3 className="font-semibold">İlaç Listesi</h3>
          <button className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            isTablet ? 'w-fit self-end' : ''
          }`}>
            + Yeni İlaç Ekle
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border rounded p-3">
            <div className={`grid gap-4 ${
              isMobile ? 'grid-cols-1' : 
              isTablet ? 'grid-cols-2' : 
              'grid-cols-5'
            }`}>
              <div>
                <label className="block text-sm mb-1">İlaç Adı</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2" 
                  placeholder="İlaç adı"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Doz</label>
                <input 
                  type="text" 
                  className="w-full border rounded p-2" 
                  placeholder="Doz"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Kullanım Şekli</label>
                <select className="w-full border rounded p-2">
                  <option value="">Seçiniz</option>
                  <option value="oral">Oral</option>
                  <option value="im">IM</option>
                  <option value="iv">IV</option>
                  <option value="sc">SC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Sıklık</label>
                <select className="w-full border rounded p-2">
                  <option value="">Seçiniz</option>
                  <option value="1x1">Günde 1x1</option>
                  <option value="2x1">Günde 2x1</option>
                  <option value="3x1">Günde 3x1</option>
                  <option value="4x1">Günde 4x1</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Süre</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    className="w-2/3 border rounded p-2" 
                    placeholder="Süre"
                    min="1"
                  />
                  <select className="w-1/3 border rounded p-2 appearance-none bg-white">
                    <option value="gun">Gün</option>
                    <option value="hafta">Hafta</option>
                    <option value="ay">Ay</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded p-3">
            <div>
              <label className="block text-sm mb-1">Reçete Notları</label>
              <textarea 
                className="w-full h-24 border rounded p-2" 
                placeholder="İlaç kullanımı ile ilgili özel notlar..."
              />
            </div>
          </div>
        </div>

        <div className={`mt-4 ${isTablet ? 'flex flex-col space-y-2' : 'flex'} gap-2`}>
          <button className={`${
            isTablet ? 'w-fit px-6' : 'w-fit px-6'
          } bg-green-500 text-white py-2 rounded hover:bg-green-600 self-end`}>
            Reçete Oluştur
          </button>
          <button className={`${
            isTablet ? 'w-fit px-6' : 'w-fit px-6'
          } bg-blue-500 text-white py-2 rounded hover:bg-blue-600 self-end`}>
            Geçmiş Reçeteler
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationsTab;