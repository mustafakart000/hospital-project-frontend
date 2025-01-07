import React from 'react';
import { FileImage } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

const ImagingTab = () => {
  const isTablet = useMediaQuery({ maxWidth: 1070 });
  const isMobile = useMediaQuery({ maxWidth: 640 });

  return (
    <div className={`${isTablet ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}>
      <div className="p-4 border rounded">
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} mb-4`}>
          <h3 className="font-semibold">Geçmiş Görüntülemeler</h3>
          <button className="bg-blue-500 text-white px-3 py-1.5 rounded flex items-center gap-2 w-fit hover:bg-blue-600">
            <FileImage size={16} />
            Yeni Ekle
          </button>
        </div>
        <div className="space-y-3">
          <div className={`border rounded p-3 ${isMobile ? 'space-y-2' : 'flex justify-between items-center'}`}>
            <div>
              <span className="font-medium">EKG</span>
              <p className="text-sm text-gray-500">24.12.2024</p>
            </div>
            <div className={`flex gap-2 ${isMobile ? 'justify-end' : ''}`}>
              <button className="text-blue-500 hover:text-blue-600">Görüntüle</button>
              <button className="text-green-500 hover:text-green-600">Sonuç Gir</button>
            </div>
          </div>
          <div className={`border rounded p-3 ${isMobile ? 'space-y-2' : 'flex justify-between items-center'}`}>
            <div>
              <span className="font-medium">Akciğer Röntgeni</span>
              <p className="text-sm text-gray-500">20.12.2024</p>
            </div>
            <div className={`flex gap-2 ${isMobile ? 'justify-end' : ''}`}>
              <button className="text-blue-500 hover:text-blue-600">Görüntüle</button>
              <button className="text-green-500 hover:text-green-600">Sonuç Gir</button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-4">Yeni Görüntüleme Talebi</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Görüntüleme Türü</label>
            <select className="w-full border rounded p-2">
              <option value="">Görüntüleme Türü Seçin</option>
              <option value="ekg">EKG</option>
              <option value="rontgen">Röntgen</option>
              <option value="mri">MR</option>
              <option value="tomografi">Tomografi</option>
              <option value="ultrason">Ultrason</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Çekim Bölgesi</label>
            <input 
              type="text" 
              className="w-full border rounded p-2" 
              placeholder="Çekim yapılacak bölge"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Talep Notları</label>
            <textarea 
              className="w-full h-24 border rounded p-2" 
              placeholder="Talep notları..."
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Öncelik Durumu</label>
            <select className="w-full border rounded p-2">
              <option value="normal">Normal</option>
              <option value="urgent">Acil</option>
            </select>
          </div>
          <button className={`${
            isMobile ? 'w-full' : 'w-fit px-6'
          } bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
            !isMobile && 'float-right'
          }`}>
            Görüntüleme Talebi Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagingTab;