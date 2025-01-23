import React, { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import Card from "@mui/material/Card";
import { Tabs, Tab, Box } from "@mui/material";
import VitalsTab from "./VitalsTab";
import DiagnosisTab from "./DiagnosisTab";
import ImagingTab from "./ImagingTab";
import LabsTab from "./LabsTab";
import { CardContent } from "@mui/material";

import { createDiagnosis } from "../../../services/treatment-panel";
import { useSelector } from "react-redux";
import TodayPatientQueue from "./TodayPatientQueue";
import CreatePrescription from "../prescription/CreatePrescription";
import { getLabRequestAll, getImagingRequestByPatientId } from "../../../services/technicians-service";

const TreatmentPanel = () => {
  const isMobile = useMediaQuery({ maxWidth: 710 });
  const { userId } = useSelector((state) => state.treatment);

  const [patientInformation, setPatientInformation] = useState(null);
  const [value, setValue] = useState("vitals");
  const [refreshQueue, setRefreshQueue] = useState(false);
  const [pendingTests, setPendingTests] = useState({ lab: 0, imaging: 0 });

  const [diagnosisValues, setDiagnosisValues] = useState({
    preliminaryDiagnosis: "",
    finalDiagnosis: "",
    diagnosticDetails: "",
    icdCode: "",
    treatmentType: "",
    treatmentDetails: "",
    followUpDate: "",
  });

  const handleDiagnosisChange = (e) => {
    const { name, value } = e.target;
    setDiagnosisValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleButtonClick = async (action) => {
    setSelectedPatient(null);

    if (value === "vitals") {
      // Vitals tab için özel işlem
      const vitalsTabRef = document.querySelector('[data-tab="vitals"]');
      if (vitalsTabRef && vitalsTabRef.handleSubmit) {
        await vitalsTabRef.handleSubmit();
      }
      return;
    }

    const payload = {
      reservationId: patientInformation?.reservationId,
      diagnosticInfo: {
        preliminaryDiagnosis: diagnosisValues.preliminaryDiagnosis || null,
        finalDiagnosis: diagnosisValues.finalDiagnosis || null,
        diagnosticDetails: diagnosisValues.diagnosticDetails || null,
        icdCode: diagnosisValues.icdCode || null,
      },
      treatmentPlan: {
        treatmentType: diagnosisValues.treatmentType || null,
        treatmentDetails: diagnosisValues.treatmentDetails || null,
        followUpDate: diagnosisValues.followUpDate || null,
      },
      actions: {
        saveAndExit: action === "saveAndExit",
        requestConsultation: action === "requestConsultation",
        createAppointment: action === "createAppointment",
      },
      metadata: {
        patientId: String(patientInformation?.patientId),
        doctorId: String(userId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };


    if (!payload.reservationId) {
      alert("Rezervasyon bilgisi eksik!");
      return;
    }

    if (!payload.metadata.patientId || !payload.metadata.doctorId) {
      alert("Hasta ve doktor bilgileri eksik!");
      return;
    }

    if (!payload.treatmentPlan.treatmentType) {
      alert("Lütfen tedavi türünü seçiniz");
      return;
    }

    try {
      await createDiagnosis(payload);
     

      setRefreshQueue((prev) => !prev);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [selectedPatient, setSelectedPatient] = useState(null);
  useEffect(() => {
    setSelectedPatient(patientInformation);
  }, [patientInformation]);

  useEffect(() => {
    const fetchPendingTests = async () => {
      if (patientInformation?.patientId) {
        try {
          const [labTests, imagingTests] = await Promise.all([
            getLabRequestAll(patientInformation.patientId),
            getImagingRequestByPatientId(patientInformation.patientId)
          ]);

          const pendingLabTests = labTests.filter(test => test.status === 'PENDING').length;
          const pendingImagingTests = imagingTests.filter(test => test.status === 'PENDING').length;

          setPendingTests({
            lab: pendingLabTests,
            imaging: pendingImagingTests
          });
        } catch (error) {
          console.error('Bekleyen testler alınamadı:', error);
        }
      }
    };

    fetchPendingTests();
  }, [patientInformation]);

  return (
    <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
      {selectedPatient && (
        <Card className={`${isMobile ? 'w-full shadow-sm' : 'w-full max-w-5xl shadow-md'} mx-auto`}>
          <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-500 pt-2 pl-4 border-b-2 border-gray-200 pb-1`}>
            {patientInformation.patientName}{" "}
            {patientInformation.patientSurname}
          </div>

          <CardContent className={isMobile ? 'p-2' : 'p-4'}>
            {/* Özet Bilgiler */}
            <div className="flex justify-start mb-6">
              <div className={`p-4 bg-purple-50 rounded ${isMobile ? 'w-full' : 'w-72'}`}>
                <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Bekleyen Testler</div>
                <div className="font-semibold flex flex-col sm:flex-row sm:items-center gap-1">
                  <span>{pendingTests.lab + pendingTests.imaging} Test{pendingTests.lab + pendingTests.imaging !== 1 && 'ler'}</span>
                  {(pendingTests.lab > 0 || pendingTests.imaging > 0) && (
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                      ({pendingTests.lab > 0 && `${pendingTests.lab} Lab`}
                      {pendingTests.lab > 0 && pendingTests.imaging > 0 && ', '}
                      {pendingTests.imaging > 0 && `${pendingTests.imaging} Görüntüleme`})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs bölümü */}
            <Box sx={{ 
              width: "100%",
              '.MuiTabs-root': {
                minHeight: isMobile ? '40px' : '48px'
              },
              '.MuiTab-root': {
                minHeight: isMobile ? '40px' : '48px',
                fontSize: isMobile ? '0.8rem' : '0.875rem',
                padding: isMobile ? '6px 12px' : '12px 16px'
              }
            }}>
              <Tabs 
                value={value} 
                onChange={handleChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Tab value="vitals" label={isMobile ? "Vital" : "Vital Bulgular"} />
                <Tab value="diagnosis" label={isMobile ? "Tanı" : "Tanı/Tedavi"} />
                <Tab value="medications" label="İlaçlar" />
                <Tab value="imaging" label="Görüntüleme" />
                <Tab value="labs" label="Lab" />
              </Tabs>

              <Box sx={{ mt: isMobile ? 1 : 2 }}>
                {value === "vitals" && (
                  <VitalsTab
                    doctorId={userId}
                    patientId={patientInformation?.patientId}
                    onSaveAndExit={() => handleButtonClick("saveAndExit")}
                  />
                )}
                {value === "diagnosis" && (
                  <DiagnosisTab
                    values={diagnosisValues}
                    onChange={handleDiagnosisChange}
                    metaData={{
                      patientId: patientInformation?.id,
                      doctorId: userId,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }}
                  />
                )}
                {value === "medications" && (
                  <CreatePrescription
                    doctorId={String(userId)}
                    patientId={String(patientInformation?.patientId)}
                    reservationId={String(patientInformation?.reservationId)}
                  />
                )}
                {value === "imaging" && <ImagingTab />}
                {value === "labs" && <LabsTab />}
              </Box>
            </Box>

            {/* Alt Aksiyon Butonları */}
            <div className={`flex ${isMobile ? 'flex-col space-y-2 mt-4 px-2' : 'flex-row justify-end mt-6'}`}>
              <button
                onClick={() => handleButtonClick("saveAndExit")}
                className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 
                  ${isMobile ? 'w-full text-sm h-12 flex items-center justify-center' : ''}`}
              >
                Kaydet ve Çık
              </button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className={isMobile ? 'mt-4' : 'mt-6'}>
        <TodayPatientQueue
          setPatientInformation={setPatientInformation}
          refresh={refreshQueue}
        />
      </div>
    </div>
  );
};

export default TreatmentPanel;
