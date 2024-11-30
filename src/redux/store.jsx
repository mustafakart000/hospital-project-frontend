import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./slices/auth-slice.js";


export default configureStore({
  reducer: {
    auth: authReducer
    
  },
});

