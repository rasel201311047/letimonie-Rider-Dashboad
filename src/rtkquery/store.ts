import { configureStore } from "@reduxjs/toolkit";
import globaldataReducer from "./slice/globaldataSlice";

export const store = configureStore({
  reducer: {
    globaldata: globaldataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
