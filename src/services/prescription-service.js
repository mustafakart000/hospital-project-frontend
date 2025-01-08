import axios from 'axios';
import { config } from '../helpers/config';
import { getAuthHeader } from './auth-header';

const BASE_URL = config.api.baseUrl;

export const createPrescription = async (prescriptionData) => {
  const response = await axios.post(
    `${BASE_URL}/prescriptions/create`,
    prescriptionData,
    { headers: getAuthHeader() }
  );
  return response.data;
};


//prescriptions/patient/25
export const getPrescriptionByPatientId = async (patientId) => {
  const response = await axios.get(`${BASE_URL}/prescriptions/patient/${patientId}`, { headers: getAuthHeader() });
  return response.data;
};

export const getPrescriptionsCurrentPatient = async () => {
  const response = await axios.get(`${BASE_URL}/prescriptions/patient`, { headers: getAuthHeader() });
  return response.data;
};

//prescriptions/doctor/25
export const getPrescriptionsCurrentDoctor = async (doctorId) => {
  const response = await axios.get(`${BASE_URL}/prescriptions/doctor/${doctorId}`, { headers: getAuthHeader() });
  return response.data;
};

