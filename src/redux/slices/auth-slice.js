import { createSlice } from "@reduxjs/toolkit";
import { getMenuItems } from "../../helpers/config/getMenuItems";
import { removeFromLocalStorage } from "../../helpers/functions/encrypted-storage";

const initialState = {
  isUserLogin: null,
  isAuthenticated: false,
  menu: [],
  error: null,
  loading: false,
  user: null,
  loginSuccess: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isUserLogin = true;
      state.loginSuccess = true;



      const currentToken = state.user?.token;

      state.user = {
        username: action.payload.username,
        role: action.payload.role,
        token: action.payload.token || currentToken,
        id: action.payload.id,
        ad: action.payload.ad || '',
        soyad: action.payload.soyad || '',
        email: action.payload.email || ''
      };

      state.menu = getMenuItems(action.payload.role);

    },
    logout: (state) => {
      state.user = null;
      state.isUserLogin = false;
      state.loginSuccess = false;
      state.isAuthenticated = false;
      state.menu = [];
      
      removeFromLocalStorage('user');
      removeFromLocalStorage('token');
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    setLoginSuccess: (state, action) => {
      state.loginSuccess = action.payload;
    },
  },
  
}

//extraReducers nedir ne işe yarar? ve uygun senaryoları nelerdir?

);

export const { 
  loginStart, 
  loginSuccess, 
  logout, 
  loginFailure,
  setLoginSuccess
} = authSlice.actions;
export default authSlice.reducer;
