import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, UserRound, ChevronRight } from "lucide-react";
import DoctorAppointments from './DoctorAppointments';

const TodayPatientQueue = () => {
  const [todayPatients, setTodayPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchTodayPatients();
  }, []);

  const fetchTodayPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/reservations/get/today');
      const data = await response.json();
      // Sort by time
      const sortedPatients = data.sort((a, b) => 
        a.reservationTime.localeCompare(b.reservationTime)
      );
      setTodayPatients(sortedPatients);
    } catch (error) {
      console.error('Error fetching today\'s patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowAppointments(true);
  };

  if (showAppointments) {
    return <DoctorAppointments 
      selectedPatient={selectedPatient}
      onBack={() => {
        setShowAppointments(false);
        setSelectedPatient(null);
      }} 
    />;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Bugünün Hasta Sırası</CardTitle>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Yükleniyor...</div>
            ) : todayPatients.length === 0 ? (
              <div className="text-center py-4">Bugün için bekleyen hasta bulunmamaktadır.</div>
            ) : (
              todayPatients.map((patient, index) => (
                <div
                  key={patient.id}
                  className={`flex items-center justify-between p-4 rounded-lg border 
                    ${index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
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
                      index === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <span>{index === 0 ? 'Tedavi Et' : 'Görüntüle'}</span>
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

export default TodayPatientQueue;