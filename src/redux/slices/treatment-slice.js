import { createSlice } from "@reduxjs/toolkit";
import { loginSuccess } from "./auth-slice";

const initialState = {
  patient: null,
  userId: null,
  patientId: null,
};

const treatmentSlice = createSlice({
  name: "treatment",
  initialState,
  reducers: {
    setPatient: (state, action) => {
      state.patient = action.payload;
      state.userId = action.payload.doctorId;
      state.patientId = action.payload.patientId;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginSuccess, (state, action) => {
      state.userId = action.payload.id;
    });
  },
});

export const { setPatient, setUserId } = treatmentSlice.actions;
export default treatmentSlice.reducer;
