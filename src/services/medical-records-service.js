import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
const baseUrl = config.api.baseUrl;

export const getMedicalRecords = async (recordId) => {
    const response = await axios.get(`${baseUrl}/medical-record/get/${recordId}`, { headers: getAuthHeader() });
    return response.data;
}

export const getMedicalRecordById = async (patientId) => {
    const response = await axios.get(`${baseUrl}/medical-record/patient/${patientId}`, { headers: getAuthHeader() });
    return response.data;
}

