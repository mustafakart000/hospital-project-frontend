import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAllSpecialties } from "../../services/doctor-service";

export const fetchSpecialties = createAsyncThunk(
  'specialties/fetchSpecialties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSpecialties();
      console.log("response1", response);
      return response; // API'den gelen uzmanlık listesi
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Uzmanlıklar alınamadı');
    }
  }
);