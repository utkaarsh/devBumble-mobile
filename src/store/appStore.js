import { configureStore } from "@reduxjs/toolkit";
import feedReducer from "./feedSlice";
import tokenReducer from "./tokenSlice";

const appStore = configureStore({
  reducer: {
    feed: feedReducer,
    token: tokenReducer,
  },
});

export default appStore;
