import { createSlice } from "@reduxjs/toolkit";
import { fetchSpecialties } from "./specialities-thunk";


// Asenkron thunk fonksiyonu


const specialtiesSlice = createSlice({
  name: "specialties",
  initialState: [],
  reducers: {
    clearSpecialties: () => [],
    addSpecialty: (state, action) => [...state, action.payload],
    removeSpecialty: (state, action) => state.filter(specialty => specialty.id !== action.payload),
    
  },
  
  extraReducers: (builder) => {
    builder.addCase(fetchSpecialties.fulfilled, (state, action) => action.payload);
  },
});

export const { clearSpecialties, addSpecialty, removeSpecialty } = specialtiesSlice.actions;
export default specialtiesSlice.reducer;

