import React from 'react';
import { useMediaQuery } from 'react-responsive';

const DiagnosisTab = () => {
  const isMobile = useMediaQuery({ maxWidth: 600 });

  return (
    <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}>
      <div className={`p-4 border rounded ${isMobile ? 'mb-4' : ''}`}>
        <h3 className="font-semibold mb-4 text-lg border-b pb-2">Tanı Bilgileri</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ön Tanı
            </label>
            <input 
              type="text" 
              className="w-full border rounded p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Ön tanıyı giriniz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Kesin Tanı
            </label>
            <input 
              type="text" 
              className="w-full border rounded p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Kesin tanıyı giriniz"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tanı Detayları
            </label>
            <textarea 
              className="w-full border rounded p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              rows={4}
              placeholder="Tanı ile ilgili detayları giriniz..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              ICD-10 Kodu
            </label>
            <input 
              type="text" 
              className="w-full border rounded p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="ICD-10 kodu giriniz"
            />
          </div>
        </div>
      </div>

      <div className={`p-4 border rounded ${isMobile ? 'mt-2' : ''}`}>
        <h3 className="font-semibold mb-4 text-lg border-b pb-2">Tedavi Planı</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tedavi Türü
            </label>
            <select className="w-full border rounded p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Seçiniz</option>
              <option value="ayaktan">Ayaktan Tedavi</option>
              <option value="yatarak">Yatarak Tedavi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tedavi Planı
            </label>
            <textarea 
              className="w-full border rounded p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              rows={4}
              placeholder="Tedavi planını detaylı olarak giriniz..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Kontrol Tarihi
            </label>
            <input 
              type="date" 
              className="w-full border rounded p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTab;