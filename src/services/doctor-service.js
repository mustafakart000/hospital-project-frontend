import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
import toast from "react-hot-toast";
const baseUrl = config.api.baseUrl;


export const getAllSpecialties = async () => {
    try {
        const response = await axios.get(`${baseUrl}/auth/allspecialties`,{headers: getAuthHeader ()})
        ////console.log("Service Response:", response);
        const data = await response.data;
        //console.log("data", data)
        return data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
}


export const createDoctor = async (doctorData) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/doctor/register`, doctorData, { headers: getAuthHeader() });
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


export const getDoctorById = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/admin/doctor/get/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
}

export const updateDoctor = async (id, doctorData) => {
    try {
        const response = await axios.put(`${baseUrl}/admin/doctor/update/${id}`, doctorData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
}

export const deleteDoctor = async (id) => {
    try {
        const response = await axios.delete(`${baseUrl}/admin/doctor/delete/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
}

export const getAllDoctors = async () => {
    try {
        const response = await axios.get(`${baseUrl}/admin/doctor/all`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
}

