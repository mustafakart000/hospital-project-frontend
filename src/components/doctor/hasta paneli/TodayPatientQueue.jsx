import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";

import { Clock, UserRound, ChevronRight } from "lucide-react";

import { Button } from "antd";

import { getTodayPatients, getTodayTreatedPatients } from "../../../services/reservation-service";

import { useDispatch } from "react-redux";
import { setPatient } from "../../../redux/slices/treatment-slice";
import PropTypes from "prop-types";


const TodayPatientQueue = ({ setPatientInformation, refresh }) => {
  const [todayPatients, setTodayPatients] = useState([]);
  const [treatedPatients, setTreatedPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodayPatients();
    fetchTreatedPatients();
  }, [refresh]);

  const dispatch = useDispatch();

  const fetchTodayPatients = async () => {
    try {
      setLoading(true);
      console.log("TodayPatientQueue.jsx fetchTodayPatients");
      const response = await getTodayPatients();
      console.log("TodayPatientQueue.jsx response: ", response);
      
      // Veri kontrolü yap
      if (!response || response.length === 0) {
        setTodayPatients([]);
        return;
      }

      const data = response;
      // Treated kontrolü yap
      const filteredData = data.filter((patient) => {
        return patient && patient.treated === false; // treated false olanları al
      });
      
      console.log("TodayPatientQueue.jsx filteredData: ", filteredData);
      
      // Sort by time
      const sortedPatients = filteredData.sort((a, b) =>
        a.reservationTime.localeCompare(b.reservationTime)
      );
      
      setTodayPatients(sortedPatients);
    } catch (error) {
      console.error("Error fetching today's patients:", error);
      setTodayPatients([]); // Hata durumunda boş array
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatedPatients = async () => {
    try {
      const response = await getTodayTreatedPatients();
      console.log("Treated patients response:", response);
      
      const sortedTreatedPatients = response.sort((a, b) =>
        a.reservationTime.localeCompare(b.reservationTime)
      );
      setTreatedPatients(sortedTreatedPatients);
    } catch (error) {
      console.error("Error fetching treated patients:", error);
      setTreatedPatients([]);
    }
  };

  const handlePatientSelect = (patient) => {
    dispatch(setPatient({
      ...patient,
      reservationId: patient.id
    }));
    setPatientInformation({
      ...patient,
      reservationId: patient.id
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-xl font-bold text-cyan-600">
        Bugün Bekleyen Hasta Kuyruğu
      </div>
      <Card>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Yükleniyor...</div>
            ) : todayPatients.length === 0 ? (
              <div className="text-center py-4">
                Bugün için bekleyen hasta bulunmamaktadır.
              </div>
            ) : (
              todayPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className={`flex items-center justify-between p-4 rounded-lg border 
                    ${index === 0 ? "bg-blue-50 border-blue-200" : "bg-white"}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <UserRound className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {patient.patientName} {patient.patientSurname}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {patient.reservationTime.substring(0, 5)}
                        </span>
                        <span>{patient.speciality}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePatientSelect(patient)}
                    className={`flex items-center space-x-2 ${
                      index === 0
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    <span>{index === 0 ? "Tedavi Et" : "Görüntüle"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-xl font-bold text-green-600 mt-8">
        Bugün Tedavi Edilmiş Hastalar
      </div>
      <Card>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Yükleniyor...</div>
            ) : treatedPatients.length === 0 ? (
              <div className="text-center py-4">
                Bugün için tedavi edilmiş hasta bulunmamaktadır.
              </div>
            ) : (
              treatedPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-green-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <UserRound className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {patient.patientName} {patient.patientSurname}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {patient.reservationTime.substring(0, 5)}
                        </span>
                        <span>{patient.speciality}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePatientSelect(patient)}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    <span>Detayları Gör</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
TodayPatientQueue.propTypes = {
  setPatientInformation: PropTypes.func.isRequired,
  refresh: PropTypes.bool.isRequired,
};

export default TodayPatientQueue;
