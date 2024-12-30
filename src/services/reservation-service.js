import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
const baseUrl = config.api.baseUrl;
//doctors
export const getAllDoctorsBySpecialtyId = async (selectedSpecialtyId) => {
    const response = await axios.get(`${baseUrl}/reservations/getall/doctors/${selectedSpecialtyId}`, { headers: getAuthHeader() });
    return response.data;
}

export const getAllDoctorByReservations = async () => {
    const response = await axios.get(`${baseUrl}/reservations/getall`, { headers: getAuthHeader() });
    return response.data;
}

export const updateReservation = async (reservationId, reservationData) => {
    const response = await axios.put(`${baseUrl}/reservations/update/${reservationId}`, reservationData, { headers: getAuthHeader() });
    return response.data;
}

export const getDoctorReservations = async (doctorId) => {
    const response = await axios.get(`${baseUrl}/reservations/get/doctor/${doctorId}`, { headers: getAuthHeader() });
    console.log("getDoctorReservations response", response);
    return response.data;
}

export const cancelReservation = async (reservationId) => {
    const response = await axios.delete(`${baseUrl}/reservations/cancel/${reservationId}`, { headers: getAuthHeader() });
    return response.data;
}


