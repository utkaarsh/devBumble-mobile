import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    getFeed: (state, action) => {
      console.log("Hitted get feed");

      return action.payload;
    },
    removeUserFromFeed: (state, action) => {
      console.log("Hitted remove feed", action.payload);
      console.log(
        "State Value ",
        state.filter((user) => user._id !== action.payload)
      );

      try {
        if (!action.payload) throw new Error("Payload undefined");
        const newFeed = state.filter((user) => user._id !== action.payload);
        return newFeed;
      } catch (error) {
        console.error("Error removing user from card : ", error);
      }
    },
    removeFeed: (state, action) => {
      return null;
    },
  },
});

export const { getFeed, removeUserFromFeed, removeFeed } = feedSlice.actions;
export default feedSlice.reducer;
