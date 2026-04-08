import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: null,
  reducers: {
    getToken: (state, action) => {
      return action.payload;
    },
    setToken: (state, action) => {
      return action.payload;
    },
    clearToken: () => null,
  },
});

export const { getToken, setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
