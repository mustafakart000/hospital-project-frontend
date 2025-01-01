import React from 'react';

const DiagnosisTab = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Tanı Bilgileri</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Ön Tanı</label>
            <input type="text" className="w-full border rounded p-2" placeholder="Ön tanıyı giriniz"/>
          </div>
          <div>
            <label className="block text-sm mb-1">Kesin Tanı</label>
            <input type="text" className="w-full border rounded p-2" placeholder="Kesin tanıyı giriniz"/>
          </div>
          <div>
            <label className="block text-sm mb-1">Tanı Detayları</label>
            <textarea 
              className="w-full h-32 border rounded p-2" 
              placeholder="Tanı ile ilgili detayları giriniz..."
            />
          </div>
          <div>
            <label className="block text-sm mb-1">ICD-10 Kodu</label>
            <input type="text" className="w-full border rounded p-2" placeholder="ICD-10 kodu giriniz"/>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Tedavi Planı</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Tedavi Türü</label>
            <select className="w-full border rounded p-2">
              <option value="">Seçiniz</option>
              <option value="ayaktan">Ayaktan Tedavi</option>
              <option value="yatarak">Yatarak Tedavi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Tedavi Planı</label>
            <textarea 
              className="w-full h-32 border rounded p-2" 
              placeholder="Tedavi planını detaylı olarak giriniz..."
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Kontrol Tarihi</label>
            <input type="date" className="w-full border rounded p-2"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTab;