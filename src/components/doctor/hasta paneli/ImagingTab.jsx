import React from 'react';
import { FileImage } from 'lucide-react';

const ImagingTab = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border rounded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Geçmiş Görüntülemeler</h3>
          <button className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-2">
            <FileImage size={16} />
            Yeni Ekle
          </button>
        </div>
        <div className="space-y-3">
          <div className="border rounded p-3 flex justify-between items-center">
            <div>
              <span className="font-medium">EKG</span>
              <p className="text-sm text-gray-500">24.12.2024</p>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-500">Görüntüle</button>
              <button className="text-green-500">Sonuç Gir</button>
            </div>
          </div>
          <div className="border rounded p-3 flex justify-between items-center">
            <div>
              <span className="font-medium">Akciğer Röntgeni</span>
              <p className="text-sm text-gray-500">20.12.2024</p>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-500">Görüntüle</button>
              <button className="text-green-500">Sonuç Gir</button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-4">Yeni Görüntüleme Talebi</h3>
        <div className="space-y-3">
          <select className="w-full border rounded p-2">
            <option value="">Görüntüleme Türü Seçin</option>
            <option value="ekg">EKG</option>
            <option value="rontgen">Röntgen</option>
            <option value="mri">MR</option>
            <option value="tomografi">Tomografi</option>
            <option value="ultrason">Ultrason</option>
          </select>
          <div>
            <label className="block text-sm mb-1">Çekim Bölgesi</label>
            <input type="text" className="w-full border rounded p-2" placeholder="Çekim yapılacak bölge"/>
          </div>
          <textarea 
            className="w-full h-24 border rounded p-2" 
            placeholder="Talep notları..."
          />
          <div>
            <label className="block text-sm mb-1">Öncelik Durumu</label>
            <select className="w-full border rounded p-2">
              <option value="normal">Normal</option>
              <option value="urgent">Acil</option>
            </select>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded">
            Görüntüleme Talebi Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagingTab;