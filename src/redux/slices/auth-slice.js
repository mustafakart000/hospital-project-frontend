import { createSlice } from "@reduxjs/toolkit";
import { getMenuItems } from "../../helpers/config/getMenuItems";

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
        id: action.payload.id,
      };
      console.log("redux/index: User:", state.user);
      
      state.menu = getMenuItems(action.payload.role);
      console.log("redux/index: Role:", action.payload.role); // Hangi role geldiğini kontrol et
      console.log("redux/index: Menu Items:", getMenuItems(action.payload.role)); // Menü öğeleri kontrolü
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
  
}

//extraReducers nedir ne işe yarar? ve uygun senaryoları nelerdir?

);

export const { loginStart, loginSuccess, logout, loginFailure } =
  authSlice.actions;
export default authSlice.reducer;
