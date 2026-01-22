import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  routeName: string;
}

const initialState: GlobalState = {
  routeName: "dashboard",
};

const globaldataSlice = createSlice({
  name: "globaldata",
  initialState,
  reducers: {
    setRouteName(state, action: PayloadAction<string>) {
      state.routeName = action.payload;
    },
    resetGlobaldata() {
      return initialState;
    },
  },
});

// Export action creators
export const { setRouteName, resetGlobaldata } = globaldataSlice.actions;

// Export reducer
export default globaldataSlice.reducer;
