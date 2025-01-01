import React from 'react';

const MedicationsTab = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="p-4 border rounded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">İlaç Listesi</h3>
          <button className="bg-blue-500 text-white px-3 py-1 rounded">
            + Yeni İlaç Ekle
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border rounded p-3">
            <div className="grid grid-cols-5 gap-3">
              <div>
                <label className="block text-sm mb-1">İlaç Adı</label>
                <input type="text" className="w-full border rounded p-2" placeholder="İlaç adı"/>
              </div>
              <div>
                <label className="block text-sm mb-1">Doz</label>
                <input type="text" className="w-full border rounded p-2" placeholder="Doz"/>
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
                  <input type="number" className="w-3/4 border rounded p-2" placeholder="Süre"/>
                  <select className="w-1/4 border rounded p-2">
                    <option value="gun">Gün</option>
                    <option value="hafta">Hafta</option>
                    <option value="ay">Ay</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded p-3">
            <div className="grid grid-cols-1">
              <div>
                <label className="block text-sm mb-1">Reçete Notları</label>
                <textarea 
                  className="w-full h-24 border rounded p-2" 
                  placeholder="İlaç kullanımı ile ilgili özel notlar..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 bg-green-500 text-white py-2 rounded">
            Reçete Oluştur
          </button>
          <button className="flex-1 bg-blue-500 text-white py-2 rounded">
            Geçmiş Reçeteler
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationsTab;