import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
const baseUrl = config.api.baseUrl;

export const getNotifications = async (doctorId) => {
    const response = await axios.get(`${baseUrl}/notifications/doctor/${doctorId}`, { headers: getAuthHeader() });
    return response.data;
}