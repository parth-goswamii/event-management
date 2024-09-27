import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotpwd",
  initialState,
  reducers: {
      userForgetPasswordSuccess(state, action) {
          state.forgetSuccessMsg = action.payload
      },
      userForgetPasswordError(state, action) {
          state.forgetError = action.payload
      },
      resetForgetPasswordState(state) { // Add reset action
        state.forgetSuccessMsg = null;
        state.forgetError = null;
      }
  },
});

export const {
  userForgetPasswordSuccess,
  userForgetPasswordError,
  resetForgetPasswordState
} = forgotPasswordSlice.actions

export default forgotPasswordSlice.reducer;
