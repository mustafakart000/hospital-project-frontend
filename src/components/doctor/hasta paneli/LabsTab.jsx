import React, { useState } from 'react';
import { TestTube } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import LabResultModal from './LabResultModal';
import { createLabRequest } from '../../../services/doctor-service';
import { toast } from 'react-hot-toast';

const LabsTab = () => {
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const isTablet = useMediaQuery({ maxWidth: 1200 });
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const [labHistory, setLabHistory] = useState([]);

  const [formData, setFormData] = useState({
    testPanels: [],
    priority: 'NORMAL',
    fastingStatus: 'AC',
    notes: ''
  });

  const handleTestPanelChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, testPanels: selectedOptions }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const labRequestData = {
        patientId: "3",
        doctorId: "2",
        reservationId: "123",
        ...formData,
        priority: formData.priority === 'urgent' ? 'URGENT' : 'NORMAL'
      };

      await createLabRequest(labRequestData);
      toast.success('Laboratuvar talebi başarıyla oluşturuldu');
      
      // Yeni talepleri geçmiş listesine ekle
      const newTests = formData.testPanels.map((test, index) => ({
        id: labHistory.length + index + 1,
        testName: test === 'tam_kan' ? 'Tam Kan Sayımı' : 
                 test === 'biyokimya' ? 'Biyokimya' :
                 test === 'hormon' ? 'Hormon Testleri' :
                 test === 'idrar' ? 'İdrar Tahlili' :
                 test === 'koagulasyon' ? 'Koagülasyon' :
                 test === 'sedim' ? 'Sedimantasyon' : 'CRP',
        date: new Date().toLocaleDateString('tr-TR'),
        status: 'pending'
      }));

      setLabHistory(prev => [...newTests, ...prev]);
      
      // Formu sıfırla
      setFormData({
        testPanels: [],
        priority: 'NORMAL',
        fastingStatus: 'AC',
        notes: ''
      });
    } catch (error) {
      toast.error('Laboratuvar talebi oluşturulurken bir hata oluştu');
      console.error('Laboratuvar talebi oluşturma hatası:', error);
    }
  };

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
            open={isResultModalOpen}
            onClose={() => setIsResultModalOpen(false)}
            result={{
              testName: "",
              date: new Date().toLocaleDateString('tr-TR'),
              status: "pending",
              notes: ""
            }}
          />
        </div>
        <div className="space-y-3">
          {labHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Henüz laboratuvar sonucu bulunmamaktadır.
            </div>
          ) : (
            labHistory.map((lab) => (
              <div key={lab.id} className={`border rounded p-3 ${isMobile ? 'space-y-2' : 'flex justify-between items-center'}`}>
                <div>
                  <span className="font-medium">{lab.testName}</span>
                  <p className="text-sm text-gray-500">{lab.date}</p>
                </div>
                <div className={`flex gap-2 ${isMobile ? 'justify-end' : ''}`}>
                  <button className="text-blue-500 hover:text-blue-600">Görüntüle</button>
                  <button className="text-green-500 hover:text-green-600">Sonuç Gir</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-4">Yeni Laboratuvar Talebi</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Test Paneli</label>
            <select 
              className="w-full border rounded p-2" 
              multiple
              name="testPanels"
              value={formData.testPanels}
              onChange={handleTestPanelChange}
            >
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
              <select 
                className="w-full border rounded p-2"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Acil</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Açlık Durumu</label>
              <select 
                className="w-full border rounded p-2"
                name="fastingStatus"
                value={formData.fastingStatus}
                onChange={handleInputChange}
              >
                <option value="AC">Aç</option>
                <option value="TOK">Tok</option>
                <option value="FARKETMEZ">Farketmez</option>
              </select>
            </div>
          </div>

            <div>
              <label className="block text-sm mb-1">Laboratuvar Notları</label>
              <textarea 
                className="w-full h-24 border rounded p-2" 
                placeholder="Laboratuvar talep notları..."
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          
            <button 
              onClick={handleSubmit}
              className={`${
                isMobile ? 'w-full' : 'w-fit px-6'
              } bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
                !isMobile && 'float-right'
              }`}
            >
              Laboratuvar Talebi Oluştur
            </button>
        </div>
      </div>
    </div>
  );
};

export default LabsTab;