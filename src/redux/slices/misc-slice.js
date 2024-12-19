import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentOperation: null,
  currentRecord: null,
  listRefreshToken: null,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setOperation: (state, action) => {
      state.currentOperation = action.payload;
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload;
    },
    setListRefreshToken: (state, action) => {
      state.listRefreshToken = action.payload;
    },
  },
});

export const { setOperation, setCurrentRecord, setListRefreshToken } = miscSlice.actions;
export default miscSlice.reducer;
