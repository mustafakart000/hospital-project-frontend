import React, { useState } from 'react';


import { TestTube } from 'lucide-react';
import LabResultModal from './LabResultModal';

const LabsTab = () => {
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border rounded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Geçmiş Laboratuvar Sonuçları</h3>
          <button 
            className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-2"
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
          <div className="border rounded p-3 flex justify-between items-center">
            <div>
              <span className="font-medium">Tam Kan Sayımı</span>
              <p className="text-sm text-gray-500">23.12.2024</p>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-500">Görüntüle</button>
              <button className="text-green-500">Sonuç Gir</button>
            </div>
          </div>
          <div className="border rounded p-3 flex justify-between items-center">
            <div>
              <span className="font-medium">Biyokimya</span>
              <p className="text-sm text-gray-500">19.12.2024</p>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-500">Görüntüle</button>
              <button className="text-green-500">Sonuç Gir</button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-4">Yeni Laboratuvar Talebi</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Test Paneli</label>
            <select className="w-full border rounded p-2" multiple >
              <option value="tam_kan">Tam Kan Sayımı</option>
              <option value="biyokimya">Biyokimya</option>
              <option value="hormon">Hormon Testleri</option>
              <option value="idrar">İdrar Tahlili</option>
              <option value="koagulasyon">Koagülasyon</option>
              <option value="sedim">Sedimantasyon</option>
              <option value="crp">CRP</option>
            </select>
          </div>
          
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

          <textarea 
            className="w-full h-24 border rounded p-2" 
            placeholder="Laboratuvar talep notları..."
          />
          
          <button className="w-full bg-blue-500 text-white py-2 rounded">
            Laboratuvar Talebi Oluştur
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabsTab;