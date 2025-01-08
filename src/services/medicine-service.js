import axios from "axios";
import { config } from "../helpers/config";
import { getAuthHeader } from "./auth-header";

const baseUrl = config.api.baseUrl;

export const getAllMedicinesByDoctorSpeciality = async () => {
  const response = await axios.get(
    `${baseUrl}/medicine/getAllByDoctorSpeciality`,
    { headers: getAuthHeader() }
  );
  return response.data;
}; 

export const getAllMedicines = async () => {
  const response = await axios.get(`${baseUrl}/medicine/getAll`, { headers: getAuthHeader() });
  return response.data;
};