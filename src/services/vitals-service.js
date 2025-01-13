import axios from "axios";
import { config } from "../helpers/config";
import { getAuthHeader } from "./auth-header";

const baseUrl = config.api.baseUrl;

export const createVitals = async (vitalsData) => {
    try {
        const response = await axios.post(
            `${baseUrl}/medical-record/create/appointment`,
            vitalsData,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error("Vitals creation error:", error);
        throw error;
    }
}; 