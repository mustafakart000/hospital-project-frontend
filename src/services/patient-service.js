import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
const baseUrl = config.api.baseUrl;

export const getPatientProfile = async (patientId) => {
    const response = await axios.get(`${baseUrl}/patient/get/${patientId}`, { headers: getAuthHeader() });
    return response.data;
}

export const createReservation = async (reservation) => {
    try {
        const headers = getAuthHeader();
        
        // Debug için
        console.log("Auth bilgileri:", {
            headers,
            token: localStorage.getItem("token"),
            user: JSON.parse(localStorage.getItem("user"))
        });
        
        const response = await axios.post(
            `${baseUrl}/reservations/create`, 
            reservation, 
            { 
                headers: getAuthHeader()
            }
        );
        console.log("response123", response.data);
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            throw new Error("Bu işlemi yapmak için yetkiniz bulunmamaktadır. Lütfen giriş yapın veya hasta hesabı kullanın.");
        }
        throw error;
    }
};





