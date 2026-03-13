import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: null,
  reducers: {
    getToken: (state, action) => {
      console.log("Hitted get feed");
      return action.payload;
    },
    setToken: (state, action) => {
      console.log("Token set on redux", action.payload);

      return action.payload;
    },
    clearToken: () => null,
  },
});

export const { getToken, setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
