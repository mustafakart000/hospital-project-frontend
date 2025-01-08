import React from 'react';
import { useMediaQuery } from 'react-responsive';

const VitalsTab = () => {
  const isMobile = useMediaQuery({ maxWidth: 720 });

  return (
    <div className="p-4">
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
        {/* Sol Kolon - Vital Bulgular */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Vital Bulgular</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Tansiyon:</span>
              <span className="font-medium">120/80</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Nabız:</span>
              <span className="font-medium">72</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Ateş:</span>
              <span className="font-medium">36.5</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Solunum:</span>
              <span className="font-medium">16</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">SpO2:</span>
              <span className="font-medium">98</span>
            </div>
          </div>
        </div>

        {/* Sağ Kolon - Ölçümler */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Ölçümler</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Boy (cm):</span>
              <span className="font-medium">175</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Kilo (kg):</span>
              <span className="font-medium">75</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">VKİ:</span>
              <span className="font-medium">24.5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Kaydet ve Çık
        </button>
      </div>
    </div>
  );
};

export default VitalsTab;