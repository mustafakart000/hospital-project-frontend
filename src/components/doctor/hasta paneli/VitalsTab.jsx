import React from 'react';

const VitalsTab = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Vital Bulgular</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Tansiyon:</span>
            <input type="text" className="border rounded px-2" placeholder="120/80"/>
          </div>
          <div className="flex justify-between">
            <span>Nabız:</span>
            <input type="text" className="border rounded px-2" placeholder="72"/>
          </div>
          <div className="flex justify-between">
            <span>Ateş:</span>
            <input type="text" className="border rounded px-2" placeholder="36.5"/>
          </div>
          <div className="flex justify-between">
            <span>Solunum:</span>
            <input type="text" className="border rounded px-2" placeholder="16"/>
          </div>
          <div className="flex justify-between">
            <span>SpO2:</span>
            <input type="text" className="border rounded px-2" placeholder="98"/>
          </div>
        </div>
      </div>
      
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-2">Ölçümler</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Boy (cm):</span>
            <input type="text" className="border rounded px-2"/>
          </div>
          <div className="flex justify-between">
            <span>Kilo (kg):</span>
            <input type="text" className="border rounded px-2"/>
          </div>
          <div className="flex justify-between">
            <span>VKİ:</span>
            <input type="text" className="border rounded px-2" disabled/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalsTab;