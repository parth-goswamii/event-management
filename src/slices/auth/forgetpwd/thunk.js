// import { userForgetPasswordSuccess, userForgetPasswordError } from "./reducer";

// //Include Both Helper File with needed methods
// import { getFirebaseBackend } from "../../../helpers/firebase_helper";

// import {
//   postFakeForgetPwd,
//   postJwtForgetPwd,
// } from "../../../helpers/fakebackend_helper";

// const fireBaseBackend = getFirebaseBackend();

// export const userForgetPassword = (user, history) => async (dispatch) => {
//   try {
//       let response;
      
//       if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {

//           response = fireBaseBackend.forgetPassword(
//               user.email
//           )

//       } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
//           response = postJwtForgetPwd(
//               user.email
//           )
//       } else {
//           response = postFakeForgetPwd(
//               user.email
//           )
//       }

//       const data = await response;

//       if (data) {
//           dispatch(userForgetPasswordSuccess(
//               "Reset link are sended to your mailbox, check there first"
//           ))
//       }
//   } catch (forgetError) {
//       dispatch(userForgetPasswordError(forgetError))
//   }
// }

import { userForgetPasswordSuccess, userForgetPasswordError } from "./reducer"; // Adjust your import as needed

export const userForgetPassword = (user, history) => async (dispatch) => {
  try {
    const response = await fetch('https://refactor-event-management.onrender.com/api/verifyEmail', { // Adjust the endpoint to your API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: user.email }), // Send the email to the backend
    });

    const data = await response.json();

    if (response.ok) {
      dispatch(userForgetPasswordSuccess("Reset link sent to your mailbox, check there first"));
      // Optionally redirect the user or handle success state
    } else {
      dispatch(userForgetPasswordError(data.message || "Failed to send reset link."));
    }
  } catch (error) {
    dispatch(userForgetPasswordError(error.message || "An unexpected error occurred."));
  }
};
