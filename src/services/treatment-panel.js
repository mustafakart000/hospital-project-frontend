import axios from "axios";
import { config } from "../helpers/config";
import { getAuthHeader } from "./auth-header";

const baseUrl = config.api.baseUrl;

export const createDiagnosis = async (diagnosis) => {
    console.log("treatment-panel.js diagnosis: ", diagnosis);
  const response = await axios.post(`${baseUrl}/doctor/diagnoses/create`, diagnosis ,
    { headers: getAuthHeader() }
  );
  
  return response;
};

export const createVitals = async (payload) => {
  const response = await axios.post(`${baseUrl}/vitals/create`, payload, { headers: getAuthHeader() });
  return response.data;
};

