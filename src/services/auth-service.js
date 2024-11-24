import axios from "axios"
import { getAuthHeader } from "./auth-header";
import { config } from "../helpers/config";
const baseUrl = config.api.baseUrl;
export const login = async (payload)=> {
   const resp = await axios.post(`${baseUrl}/auth/login`, payload)
    const data = await resp.data;
    // console.log("auth-service.js login=> ")
    // console.log(resp.data)
    // console.log(getAuthHeader())
    return data;
}

export const getUser = async () => {
    const resp = await axios.get(`${baseUrl}/user/me`,{headers: getAuthHeader()})
    const data = await resp.data;
    return data;
}
