import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
const baseUrl = config.api.baseUrl;

export const getPatientProfile = async (patientId) => {
    const response = await axios.get(`${baseUrl}/patient/get/${patientId}`, { headers: getAuthHeader() });
    return response.data;
}

export const createReservation = async (reservation) => {
    const response = await axios.post(`${baseUrl}/reservation/create`, reservation, { headers: getAuthHeader() });
    return response.data;
}





