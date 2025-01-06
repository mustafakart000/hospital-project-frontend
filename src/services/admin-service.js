import axios from "axios";
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
import toast from "react-hot-toast";
const baseUrl = config.api.baseUrl;


export const createAdmin = async (adminData) => {
    try {
        const response = await axios.post(`${baseUrl}/auth/admin/register`, adminData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        if (error.response) {
            //console.log("error.response", error.response)
            // Hata mesajını burada döndürebilir veya işleyebilirsiniz
            const { status, message } = error.response.data;
            console.error("Service Error:", message); // Hata mesajını logluyoruz
            toast.error(message);
            throw new Error(`Error ${status}: ${message}`);
        }else if(error.message.includes("for key 'admin.UK_")){
            toast.error("Kullanıcı adı zaten kullanılmaktadır.");
        } else {
            // Hata bir HTTP hatası değilse, genel hata loglama
            console.error("Unexpected Error:", error);
            throw error;
        }
    }
};

export const deleteAdmin = async (id) => {
    try {
        const response = await axios.delete(`${baseUrl}/admin/delete/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
};

export const getAllAdmins = async () => {
    try {
        const response = await axios.get(`${baseUrl}/admin/all`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
};

export const getAdminById = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/admin/get/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
};

export const updateAdmin = async (id, adminData) => {
    try {
        const response = await axios.put(`${baseUrl}/admin/update/${id}`, adminData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error;
    }
};

