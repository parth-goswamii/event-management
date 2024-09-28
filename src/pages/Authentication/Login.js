import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Grid,
  Typography,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { loginUser, resetLoginFlag } from "../../slices/thunks";
import logoLight from "../../assets/images/shiv_fullsize_anim.png";
import { createSelector } from "reselect";
import { BASEURL, loginURL } from "../../API/api_helper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {setItem} from "../../common/constants/enums";
import "../../STYLE/LoginStyle.css";
import {
  LOGIN_TITLE,
  EMAIL_LABEL,
  PASSWORD_LABEL,
  PLACEHOLDER_EMAIL,
  PLACEHOLDER_PASSWORD,
  FORGOT_PASSWORD,
  WELCOME_BACK,
  SIGN_IN_MESSAGE,
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  ERROR_CHECK_CREDENTIALS,
  PLEASE_ENTER_YOUR_EMAIL,
  PLEASE_ENTER_YOUR_PASSWORD,
  LOADING,
  SIGNIN,
  EMAIL_IS_REQUIRED,
  PASSWORD_IS_REQUIRED,
  PLEASE_ENTER_VALID_EMAIL_ADDRESS,
  PASSWORD_8_CHAR,
  PASSWORD_CAPITAL_MESSAGE,
} from "../../common/constants/commonNames";
import BaseButton from "../../common/components/BaseButton";
import BaseTextField from "../../common/components/BaseTextField";
import { StatusCodes } from "http-status-codes";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectLayoutState = (state) => state;
  const [loading, setLoading] = useState(false); // Local loading state
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state.Account.user,
    error: state.Login.error,
    loading: state.Login.loading,
    errorMsg: state.Login.errorMsg,
  }));

  const { error, errorMsg } = useSelector(loginpageData);
  const [showPassword, setShowPassword] = useState(false);

  const validation = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
      .email(PLEASE_ENTER_VALID_EMAIL_ADDRESS)
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PLEASE_ENTER_VALID_EMAIL_ADDRESS
      )
      .required(EMAIL_IS_REQUIRED),

      password: Yup.string()
      .required(PASSWORD_IS_REQUIRED)
      .min(8, PASSWORD_8_CHAR)
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        PASSWORD_CAPITAL_MESSAGE
      ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(`${BASEURL}${loginURL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }).then((res) => res.json());

        if (response.statusCode === StatusCodes.OK) {
          setItem("authToken", response.data);
          toast.success(response.message);
          dispatch(loginUser(response.data, navigate));
        } else {
          toast.error(response.message || ERROR_CHECK_CREDENTIALS);
        }
      } catch (error) {
        toast.error(ERROR_MESSAGE);
      }finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (errorMsg) {
        dispatch(resetLoginFlag());
    }
  }, [dispatch, errorMsg]);

  document.title = LOGIN_TITLE;

  return (
    <React.Fragment>
      <ParticlesAuth>
        <Box className="auth-page-content">
          <Container className="mt-1">
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <Box className="logincss">
                  <Link to="/" className="d-inline-block auth-logo mt-4">
                    <img
                      src={logoLight}
                      alt="SHIVINFOTECH LOGO"
                      className="logocss"
                    />
                  </Link>
                </Box>
              </Grid>
            </Grid>

            <Grid container justifyContent="center" className="mt-4">
              <Grid item md={8} lg={6} xl={5}>
                <Card className="mt-4 card-custom">
                  <CardContent className="p-3">
                    <Box className="text-center mt-2">
                      <Typography variant="h5" className="text-primary">
                        {WELCOME_BACK}
                      </Typography>
                      
                    </Box>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Box
                      component="form"
                      onSubmit={validation.handleSubmit}
                      className="form-box"
                    >
                      <BaseTextField
                        label={EMAIL_LABEL}
                        name="email"
                        type="email"
                        placeholder={PLACEHOLDER_EMAIL}
                        value={validation.values.email}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        error={
                          validation.touched.email &&
                          Boolean(validation.errors.email)
                        }
                        helperText={
                          validation.touched.email && validation.errors.email
                        }
                      />
                      <Box mt={3}>
                        <Box display="flex" className="float-end">
                          <Link to="/forgot-password" className="text-muted mt-0">
                            {FORGOT_PASSWORD}
                          </Link>
                          
                        </Box>
                        <BaseTextField
                          label={PASSWORD_LABEL}
                          name="password"
                          type="password"
                          placeholder={PLACEHOLDER_PASSWORD}
                          value={validation.values.password}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          error={
                            validation.touched.password &&
                            Boolean(validation.errors.password)
                          }
                          helperText={
                            validation.touched.password &&
                            validation.errors.password
                          }
                          showPasswordToggle
                        />
                      </Box>

                      <Box mt={4}>
                        <BaseButton
                          text={loading ? "" : SIGNIN}
                          onClick={validation.handleSubmit}
                          loading={loading}
                          variant="contained"
                          color="success"
                          fullWidth
                          type="submit"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Login;
