import { loginSuccess, logoutUserSuccess, apiError, reset_login_flag } from './reducer';

export const loginUser = (responseData, navigate) => (dispatch) => {
  try {
    sessionStorage.setItem("authUser", JSON.stringify(responseData)); 
    dispatch(loginSuccess(responseData));
    navigate("/dashboard");
  } catch (error) {
    dispatch(apiError(error.message));
  }
};

export const logoutUser = () => (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    dispatch(logoutUserSuccess(true));
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};