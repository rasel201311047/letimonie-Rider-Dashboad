import { configureStore } from "@reduxjs/toolkit";
import globaldataReducer from "./slice/globaldataSlice";
import { baseApi } from "./baseApi";

export const store = configureStore({
  reducer: {
    globaldata: globaldataReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
