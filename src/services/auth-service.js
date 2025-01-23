import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
import { toast } from 'react-hot-toast';
const baseUrl = config.api.baseUrl;

export const userLogin = async (payload) => {
    try {
        const resp = await axios.post(`${baseUrl}/auth/login`, payload);
        // Login başarılı olduktan sonra hemen kullanıcı bilgilerini alalım
        if (resp.data.token) {
            // Token'ı headers'a ekleyelim
            const userResp = await axios.get(`${baseUrl}/auth/me`, {
                headers: { Authorization: `Bearer ${resp.data.token}` }
            });
            // Login yanıtı ile kullanıcı bilgilerini birleştirelim
            return {
                ...resp,
                data: {
                    ...resp.data,
                    ...userResp.data
                }
            };
        }
        return resp;
    } catch (error) {
        toast.error(error.response?.data?.message || "Giriş başarısız");
        return Promise.reject(error);
    }
        
    // ////console.log("auth-service.js login=> ")
    // ////console.log(resp.data)
    // ////console.log(getAuthHeader())
    
}

export const getUser = async () => {
    const resp = await axios.get(`${baseUrl}/auth/me`, { headers: getAuthHeader() });
    const data = await resp.data;
    return data;
}