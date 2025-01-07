import React, { useState } from 'react';
import { TestTube } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import LabResultModal from './LabResultModal';

const LabsTab = () => {
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const isTablet = useMediaQuery({ maxWidth: 1200 });
  const isMobile = useMediaQuery({ maxWidth: 640 });

  return (
    <div className={`${isTablet ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}>
      <div className="p-4 border rounded">
        <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'} mb-4`}>
          <h3 className="font-semibold">Geçmiş Laboratuvar Sonuçları</h3>
          <button 
            className="bg-blue-500 text-white px-3 py-1.5 rounded flex items-center gap-2 w-fit hover:bg-blue-600"
            onClick={() => setIsResultModalOpen(true)}
          >
            <TestTube size={16} />
            Yeni Sonuç Ekle
          </button>
          <LabResultModal 
            isOpen={isResultModalOpen}
            onClose={() => setIsResultModalOpen(false)}
          />
        </div>
        <div className="space-y-3">
          <div className={`border rounded p-3 ${isMobile ? 'space-y-2' : 'flex justify-between items-center'}`}>
            <div>
              <span className="font-medium">Tam Kan Sayımı</span>
              <p className="text-sm text-gray-500">23.12.2024</p>
            </div>
            <div className={`flex gap-2 ${isMobile ? 'justify-end' : ''}`}>
              <button className="text-blue-500 hover:text-blue-600">Görüntüle</button>
              <button className="text-green-500 hover:text-green-600">Sonuç Gir</button>
            </div>
          </div>
          <div className={`border rounded p-3 ${isMobile ? 'space-y-2' : 'flex justify-between items-center'}`}>
            <div>
              <span className="font-medium">Biyokimya</span>
              <p className="text-sm text-gray-500">19.12.2024</p>
            </div>
            <div className={`flex gap-2 ${isMobile ? 'justify-end' : ''}`}>
              <button className="text-blue-500 hover:text-blue-600">Görüntüle</button>
              <button className="text-green-500 hover:text-green-600">Sonuç Gir</button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-4">Yeni Laboratuvar Talebi</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Test Paneli</label>
            <select className="w-full border rounded p-2" multiple>
              <option value="tam_kan">Tam Kan Sayımı</option>
              <option value="biyokimya">Biyokimya</option>
              <option value="hormon">Hormon Testleri</option>
              <option value="idrar">İdrar Tahlili</option>
              <option value="koagulasyon">Koagülasyon</option>
              <option value="sedim">Sedimantasyon</option>
              <option value="crp">CRP</option>
            </select>
          </div>
          
          <div className={`${!isMobile ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
            <div>
              <label className="block text-sm mb-1">Öncelik Durumu</label>
              <select className="w-full border rounded p-2">
                <option value="normal">Normal</option>
                <option value="urgent">Acil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Açlık Durumu</label>
              <select className="w-full border rounded p-2">
                <option value="ac">Aç</option>
                <option value="tok">Tok</option>
                <option value="farketmez">Farketmez</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Laboratuvar Notları</label>
            <textarea 
              className="w-full h-24 border rounded p-2" 
              placeholder="Laboratuvar talep notları..."
            />
          </div>
          
          <button className={`${
            isMobile ? 'w-full' : 'w-fit px-6'
          } bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
            !isMobile && 'float-right'
          }`}>
            Laboratuvar Talebi Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabsTab;