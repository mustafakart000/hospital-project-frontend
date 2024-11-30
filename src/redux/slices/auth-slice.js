import { createSlice } from "@reduxjs/toolkit";
import { getMenuItems } from "../../helpers/functions/user-menu";

const initialState = {
  isUserLogin: null,
  isAuthenticated: false,
  menu: [],
  error: null,
  loading: false,
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

      state.user = {
        username: action.payload.username,
        role: action.payload.role,
        token: action.payload.token,
      };

      state.menu = getMenuItems(action.payload.role);
    },
    logout: (state) => {
      state.user = null;
      state.isUserLogin = false;
      state.menu = [];
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { loginStart, loginSuccess, logout, loginFailure } =
  authSlice.actions;
export default authSlice.reducer;
