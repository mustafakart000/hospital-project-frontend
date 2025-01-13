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
import { getAllDoctorByReservations } from "../../../services/reservation-service";
import CreatePrescription from "../prescription/CreatePrescription";

const getLastAppointmentDate = (allReservations, patientId) => {
  if (!allReservations || !patientId) return null;

  const patientReservations = allReservations.filter(
    (reservation) => reservation.patientId === patientId
  );

  if (patientReservations.length === 0) return null;

  const sortedAppointments = patientReservations.sort(
    (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
  );

  return sortedAppointments[0]?.appointmentDate;
};

const TreatmentPanel = () => {
  const isMobile = useMediaQuery({ maxWidth: 610 });
  const { patient, userId } = useSelector((state) => state.treatment);
  console.log("TreatmentPanel.jsx patient: ", patient);
  console.log("TreatmentPanel.jsx userId: ", userId);
  const [patientInformation, setPatientInformation] = useState(null);
  const [value, setValue] = useState("vitals");
  const [allReservations, setAllReservations] = useState(null);
  const [refreshQueue, setRefreshQueue] = useState(false);

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

    console.log("Gönderilen payload:", payload);

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
      const response = await createDiagnosis(payload);
      const allReservations = await getAllDoctorByReservations(userId);
      setAllReservations(allReservations);
      console.log("API Response:", response);

      setRefreshQueue((prev) => !prev);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [selectedPatient, setSelectedPatient] = useState(null);
  useEffect(() => {
    setSelectedPatient(patientInformation);
    console.log("TreatmentPanel.jsx selectedPatient: ", selectedPatient);
  }, [patientInformation]);
  return (
    <>
      <div>
        {selectedPatient && (
          <Card className={`${isMobile ? 'w-full' : 'w-full max-w-5xl'} mx-auto`}>
            <div className="text-2xl font-bold text-gray-500 pt-2 pl-4 border-b-2 border-gray-200 pb-1">
              {patientInformation.patientName}{" "}
              {patientInformation.patientSurname}
            </div>

            <CardContent>
              {/* Özet Bilgiler */}
              <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 mb-6`}>
                <div className="p-4 bg-blue-50 rounded">
                  <div className={`text-${isMobile ? 'xs' : 'sm'} text-gray-600`}>Son Randevu</div>
                  <div className="font-semibold">
                    {getLastAppointmentDate(
                      allReservations,
                      patientInformation?.id
                    ) || "Randevu Yok"}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <div className={`text-${isMobile ? 'xs' : 'sm'} text-gray-600`}>Tanı</div>
                  <div className="font-semibold">Hipertansiyon</div>
                </div>
                <div className="p-4 bg-purple-50 rounded">
                  <div className={`text-${isMobile ? 'xs' : 'sm'} text-gray-600`}>Bekleyen Testler</div>
                  <div className="font-semibold">2 Test</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded">
                  <div className={`text-${isMobile ? 'xs' : 'sm'} text-gray-600`}>Sonraki Randevu</div>
                  <div className="font-semibold">15.01.2025</div>
                </div>
              </div>

              {/* Tabs bölümü */}
              <Box sx={{ width: "100%" }}>
                <Tabs 
                  value={value} 
                  onChange={handleChange}
                  variant={isMobile ? "scrollable" : "standard"}
                  scrollButtons={isMobile ? "auto" : false}
                >
                  <Tab value="vitals" label={isMobile ? "Vital" : "Vital Bulgular"} />
                  <Tab value="diagnosis" label={isMobile ? "Tanı" : "Tanı/Tedavi"} />
                  <Tab value="medications" label="İlaçlar" />
                  <Tab value="imaging" label="Görüntüleme" />
                  <Tab value="labs" label="Lab" />
                </Tabs>

                <Box sx={{ mt: 2 }}>
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
              <div className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-end'} gap-3 mt-6`}>
                <button
                  onClick={() => handleButtonClick("saveAndExit")}
                  className={`px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 transition-colors duration-200 ${isMobile ? 'w-full' : ''}`}
                >
                  Kaydet ve Çık
                </button>
                <button
                  onClick={() => handleButtonClick("requestConsultation")}
                  className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white rounded ${isMobile ? 'w-full' : ''}`}
                >
                  Konsültasyon İste
                </button>
                <button
                  onClick={() => handleButtonClick("createAppointment")}
                  className={`px-4 py-2 bg-green-500 hover:bg-green-600 transition-colors duration-200 text-white rounded ${isMobile ? 'w-full' : ''}`}
                >
                  Randevu Oluştur
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <div>
        <TodayPatientQueue
          setPatientInformation={setPatientInformation}
          refresh={refreshQueue}
        />
      </div>
    </>
  );
};

export default TreatmentPanel;
