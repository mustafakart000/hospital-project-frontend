import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/auth-slice.js";
import miscReducer from "./slices/misc-slice.js";
import specialtiesReducer from "./slices/specialties-slice.js";

export default configureStore({
  reducer: {
    auth: authReducer,
    misc: miscReducer,
    specialties: specialtiesReducer,
  },
});

