import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
const baseUrl = config.api.baseUrl;
//doctors
export const getAllDoctorsBySpecialtyId = async (selectedSpecialtyId) => {
    const response = await axios.get(`${baseUrl}/reservations/getall/doctors/${selectedSpecialtyId}`, { headers: getAuthHeader() });
    return response.data;
}