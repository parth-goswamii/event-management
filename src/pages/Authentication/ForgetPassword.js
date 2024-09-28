import React, { useState } from "react";
import { Container, Box, Grid, Alert, Card, CardContent, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik"; 
import { userForgetPasswordSuccess, userForgetPasswordError } from "../../slices/auth/forgetpwd/reducer";
import logoLight from "../../assets/images/shiv_fullsize_anim.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASEURL, verifyEmailUrl } from "../../API/api_helper";
import { StatusCodes } from "http-status-codes";
import { EMAIL_SENT_SUCCESS, ERROR_MESSAGE, FAILED_TO_SENT_RESET_LINK, FORGOT_PASSWORD_TITLE, PLEASE_ENTER_YOUR_EMAIL, RESET_LINK_SENT, ENTER_YOUR_EMAIL_AND_INSTRUCTIONS_WILL_BE_SENT, PLACEHOLDER_EMAIL, SENDING, SEND_RESET_LINK, WAIT_I_REMEMBER_MY_PASS, CLICK_HERE, EMAIL_LABEL, FORGOT_PASSWORD, RESET_PASSWORD_WITH_SI, PLEASE_ENTER_VALID_EMAIL_ADDRESS, EMAIL_IS_REQUIRED } from "../../common/constants/commonNames";
import BaseButton from "../../common/components/BaseButton";
import BaseTextField from "../../common/components/BaseTextField";
import "../../STYLE/ForgotPWD.css";

const ForgetPasswordPage = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const userForgetPassword = (user) => async (dispatch) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASEURL}${verifyEmailUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });
  
      const data = await response.json();

      if (data.statusCode === StatusCodes.OK) {
        dispatch(userForgetPasswordSuccess(data.message));
        toast.success(data.message);
          navigate("/update-password");
      } else {
        dispatch(userForgetPasswordError(data.message));
        toast.error(data.message);
      }
    } catch (error) {
      dispatch(userForgetPasswordError(error.message));
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
      .email(PLEASE_ENTER_VALID_EMAIL_ADDRESS)
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PLEASE_ENTER_VALID_EMAIL_ADDRESS
      )
      .required(EMAIL_IS_REQUIRED)
    }),
    onSubmit: (values) => {
      dispatch(userForgetPassword(values));
    }
  });

  const { forgetError, forgetSuccessMsg } = useSelector((state) => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
  }));

  document.title = FORGOT_PASSWORD_TITLE;

  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container className="mt-1">
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Box className="auth-logo" display="flex" justifyContent="center" alignItems="center">
                <Link to="/" className="d-inline-block auth-logo">
                  <img src={logoLight} alt="" />
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Grid container justifyContent="center" className="mt-4">
            <Grid item md={8} lg={6} xl={5} justifyContent="center">
              <Card className="card-container mt-4">
                <CardContent>
                  <div className="text-center mt-2 mb-3">
                    <Typography variant="h5" className="text-primary">{FORGOT_PASSWORD}</Typography>
                  </div>
                  <Alert severity="warning" className="text-center mx-2">
                    {ENTER_YOUR_EMAIL_AND_INSTRUCTIONS_WILL_BE_SENT}
                  </Alert>
                  <div>
                    <Box component="form" onSubmit={validation.handleSubmit} className="form-box">
                      <BaseTextField
                        label={EMAIL_LABEL}
                        name="email"
                        type="email"
                        placeholder={PLACEHOLDER_EMAIL}
                        value={validation.values.email}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        error={validation.touched.email && Boolean(validation.errors.email)}
                        helperText={validation.touched.email && validation.errors.email}
                      />

                      <Box className="text-center mt-4">
                        <BaseButton
                          text={loading ? "": SEND_RESET_LINK}
                          onClick={validation.handleSubmit}
                          loading={loading}
                          variant="contained"
                          color="success"
                          fullWidth
                          type="submit"
                        />
                      </Box>
                    </Box>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 text-center">
                <Typography variant="body2" className="mb-0">
                  {WAIT_I_REMEMBER_MY_PASS} <Link to="/login" className="fw-semibold text-primary text-decoration-underline">{CLICK_HERE}</Link>
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default withRouter(ForgetPasswordPage);
