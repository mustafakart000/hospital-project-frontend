import React from 'react';
import Card from '@mui/material/Card';
import { Tabs, Tab, Box } from '@mui/material';
import VitalsTab from './VitalsTab';
import DiagnosisTab from './DiagnosisTab';
import MedicationsTab from './MedicationsTab';
import ImagingTab from './ImagingTab';
import LabsTab from './LabsTab';
import { CardContent, CardHeader } from '@mui/material';
import { CardTitle } from '@chakra-ui/react';

const TreatmentPanel = () => {
  const [value, setValue] = React.useState('vitals');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-xl font-bold">Hasta Takip Paneli</CardTitle>
          <div className="text-sm text-gray-500 mt-1">
            Hasta: Ahmet Yılmaz | Yaş: 45 | ID: 123456
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
            Hasta Geçmişi
          </button>
          <button className="bg-green-100 text-green-700 px-3 py-1 rounded">
            Yeni Randevu
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Özet Bilgiler */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded">
            <div className="text-sm text-gray-600">Son Randevu</div>
            <div className="font-semibold">24.12.2024</div>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <div className="text-sm text-gray-600">Tanı</div>
            <div className="font-semibold">Hipertansiyon</div>
          </div>
          <div className="p-4 bg-purple-50 rounded">
            <div className="text-sm text-gray-600">Bekleyen Testler</div>
            <div className="font-semibold">2 Test</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded">
            <div className="text-sm text-gray-600">Sonraki Randevu</div>
            <div className="font-semibold">15.01.2025</div>
          </div>
        </div>

        {/* Tabs bölümünü MUI ile değiştiriyoruz */}
        <Box sx={{ width: '100%' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab value="vitals" label="Vital Bulgular" />
            <Tab value="diagnosis" label="Tanı/Tedavi" />
            <Tab value="medications" label="İlaçlar" />
            <Tab value="imaging" label="Görüntüleme" />
            <Tab value="labs" label="Laboratuvar" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {value === 'vitals' && <VitalsTab />}
            {value === 'diagnosis' && <DiagnosisTab />}
            {value === 'medications' && <MedicationsTab />}
            {value === 'imaging' && <ImagingTab />}
            {value === 'labs' && <LabsTab />}
          </Box>
        </Box>

        {/* Alt Aksiyon Butonları */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 border rounded text-gray-600">
            Kaydet ve Çık
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Konsültasyon İste
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded">
            Randevu Oluştur
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TreatmentPanel;