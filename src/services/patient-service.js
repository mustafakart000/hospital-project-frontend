import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
import toast from "react-hot-toast";


const baseUrl = config.api.baseUrl;


export const getPatientProfile = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/patient/get/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.warn(`Hasta ID ${id} bulunamadı`);
            return {
                ad: 'Bilinmeyen',
                soyad: 'Hasta'
            };
        }
        console.error('Hasta bilgileri alınamadı:', error);
        throw error;
    }
};

export const createReservation = async (reservation) => {
    try {

        const response = await axios.post(
            `${baseUrl}/reservations/create`, 
            reservation, 
            { 
                headers: getAuthHeader()
            }
        );
      
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            throw new Error("Bu işlemi yapmak için yetkiniz bulunmamaktadır. Lütfen giriş yapın veya hasta hesabı kullanın.");
        }
        throw error;
    }
};

export const createPatient = async (patientData) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/register`, patientData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (error.response) {
            //console.log("error.response", error.response)
            // Hata mesajını burada döndürebilir veya işleyebilirsiniz
            const { status, message } = error.response.data;
            console.error("Service Error:", message); // Hata mesajını logluyoruz
            toast.error(message);
            throw new Error(`Error ${status}: ${message}`);
        }else if(error.message.includes("for key 'user.UK_")){
            toast.error("Kullanıcı adı zaten kullanılmaktadır.");
        } else {
            // Hata bir HTTP hatası değilse, genel hata loglama
            console.error("Unexpected Error:", error);
            throw error;
        }
    }
};


export const updatePatientProfile = async (patientId, patient) => {
    const response = await axios.put(`${baseUrl}/patient/admin/update/${patientId}`, patient, { headers: getAuthHeader() });
    return response.data;
}

export const updatePatient = async (patientId, patient) => {
    const response = await axios.put(`${baseUrl}/patient/update/${patientId}`, patient, { headers: getAuthHeader() });
    return response.data;
}

export const deletePatient = async (patientId) => {
    try {
        const response = await axios.delete(`${baseUrl}/patient/delete/${patientId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Error deleting patient:', error);
        throw error;
    }
};

export const getAllPatients = async (page, size, searchTerm = '') => {
    try {                              
        const response = await axios.get(`${baseUrl}/patient/getall?searchTerm=${searchTerm}&page=${page}&size=${size}`, { headers: getAuthHeader() });

        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
};





