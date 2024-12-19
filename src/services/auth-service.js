import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
import { toast } from 'react-hot-toast';
const baseUrl = config.api.baseUrl;
//console.log(baseUrl)

export const userLogin = async (payload)=> {
    try {
        // //console.log("userLogin payload: ", payload)
        const resp = await axios.post(`${baseUrl}/auth/login`, payload)
        //  console.log("userLogin resp: ", resp)
        return resp;
    } catch (error) {
        toast.error(error.response?.data?.message || "Giriş başarısız");
        //console.log("111111")
        return Promise.reject(error);
    }
        
    // //console.log("auth-service.js login=> ")
    // //console.log(resp.data)
    // //console.log(getAuthHeader())
    
}

export const getUser = async () => {
    const resp = await axios.get(`${baseUrl}/auth/me`,{headers: getAuthHeader()})
    const data = await resp.data;
    
    return data;
}
