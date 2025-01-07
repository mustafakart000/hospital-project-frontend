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
import { useMediaQuery } from 'react-responsive';

const TreatmentPanel = () => {
  const [value, setValue] = React.useState('vitals');
  const isMobile = useMediaQuery({ maxWidth: 720 });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-between items-center`}>
        <div>
          <CardTitle className="text-xl font-bold">Hasta Takip Paneli</CardTitle>
          <div className="text-sm text-gray-500 mt-1">
            Hasta: Ahmet Yılmaz | Yaş: 45 | ID: 123456
          </div>
        </div>
        <div className={`flex gap-2 ${isMobile ? 'mt-4 w-full justify-center' : ''}`}>
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
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 mb-6`}>
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

        {/* Tabs bölümü */}
        <Box sx={{ width: '100%' }}>
          <Tabs 
            value={value} 
            onChange={handleChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
          >
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
        <div className={`flex ${isMobile ? 'flex-col' : 'justify-end'} gap-3 mt-6`}>
          <button 
            className={`
              px-4 py-2 rounded 
              border border-gray-300 
              text-gray-700 
              bg-white 
              hover:bg-gray-50 
              hover:border-gray-400 
              transition-colors 
              duration-200 
              ${isMobile ? 'w-full' : ''}
            `}
          >
            Kaydet ve Çık
          </button>
          <button 
            className={`
              px-4 py-2 rounded 
              bg-blue-500 
              text-white 
              hover:bg-blue-600 
              active:bg-blue-700 
              shadow-sm 
              hover:shadow 
              transition-all 
              duration-200 
              ${isMobile ? 'w-full' : ''}
            `}
          >
            Konsültasyon İste
          </button>
          <button 
            className={`
              px-4 py-2 rounded 
              bg-green-500 
              text-white 
              hover:bg-green-600 
              active:bg-green-700 
              shadow-sm 
              hover:shadow 
              transition-all 
              duration-200 
              ${isMobile ? 'w-full' : ''}
            `}
          >
            Randevu Oluştur
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TreatmentPanel;