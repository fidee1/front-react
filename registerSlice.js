import { createSlice } from "@reduxjs/toolkit";

const registerSlice = createSlice({
  name: "register",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});

export const { registerStart, registerSuccess, registerFailure } = registerSlice.actions;

export default registerSlice.reducer;
