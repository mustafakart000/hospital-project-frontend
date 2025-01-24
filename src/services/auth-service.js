import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
import { toast } from 'react-hot-toast';
import JSEncrypt from 'jsencrypt';

const baseUrl = config.api.baseUrl;

const authService = {
    publicKey: null,
    getPublicKey: async function() {
        if (!this.publicKey) {
            const resp = await axios.get(`${baseUrl}/auth/public-key`);
            this.publicKey = resp.data;

        }
        return this.publicKey;
    },
    login: async function(password) {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(await this.getPublicKey());
        const encryptedPassword = encrypt.encrypt(password);
        return encryptedPassword;
    }
}




export const userLogin = async (payload) => {
    payload.password = await authService.login(payload.password);

    try {
        // payload.password = await authService.login(payload.password);
        
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




