import React from "react";
import PropTypes from "prop-types";
import { useMediaQuery } from 'react-responsive';


const DiagnosisTab = ({ values, onChange }) => {
  const isMobile = useMediaQuery({ maxWidth: 600 });



  return (
    <div className={`${isMobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}>
      <div className={`p-4 border rounded ${isMobile ? 'mb-4' : ''}`}>
        <h3 className="font-semibold mb-4 text-lg border-b pb-2">Tanı Bilgileri</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Ön Tanı</label>
            <input
              type="text"
              name="preliminaryDiagnosis"
              value={values.preliminaryDiagnosis}
              onChange={onChange}
              className="w-full border rounded p-2"
              placeholder="Ön tanıyı giriniz"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Kesin Tanı</label>
            <input
              type="text"
              name="finalDiagnosis"
              value={values.finalDiagnosis}
              onChange={onChange}
              className="w-full border rounded p-2"
              placeholder="Kesin tanıyı giriniz"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Tanı Detayları</label>
            <textarea
              name="diagnosticDetails"
              value={values.diagnosticDetails}
              onChange={onChange}
              className="w-full h-32 border rounded p-2"
              placeholder="Tanı ile ilgili detayları giriniz..."
            />
          </div>
          <div>
            <label className="block text-sm mb-1">ICD-10 Kodu</label>
            <input
              type="text"
              name="icdCode"
              value={values.icdCode}
              onChange={onChange}
              className="w-full border rounded p-2"
              placeholder="ICD-10 kodu giriniz"
            />
          </div>
        </div>
      </div>

      <div className={`p-4 border rounded ${isMobile ? 'mt-2' : ''}`}>
        <h3 className="font-semibold mb-4 text-lg border-b pb-2">Tedavi Planı</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Tedavi Türü</label>
            <select
              name="treatmentType"
              value={values.treatmentType}
              onChange={onChange}
              className="w-full border rounded p-2"
            >
              <option value="">Seçiniz</option>
              <option value="OUTPATIENT">Ayaktan Tedavi</option>
              <option value="INPATIENT">Yatarak Tedavi</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Tedavi Planı</label>
            <textarea
              name="treatmentDetails"
              value={values.treatmentDetails}
              onChange={onChange}
              className="w-full h-32 border rounded p-2"
              placeholder="Tedavi planını detaylı olarak giriniz..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

DiagnosisTab.propTypes = {
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default DiagnosisTab;
