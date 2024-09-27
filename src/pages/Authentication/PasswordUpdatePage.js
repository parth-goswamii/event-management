import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import withRouter from "../../Components/Common/withRouter";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import logoLight from "../../assets/images/shiv_fullsize_anim.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseButton from "../../common/components/BaseButton";
import BaseTextField from "../../common/components/BaseTextField";
import { BASEURL, updatePasswordUrl } from "../../API/api_helper";
import { StatusCodes } from "http-status-codes";
import {
  CONFIRM_PASSWORD_LABEL,
  CONFIRM_PASSWORD_REQUIRED,
  EMAIL_REQUIRED,
  ERROR_DURING_PASS_UPDATE,
  ERROR_UPDATING_PASSWORD,
  INVALID_EMAIL,
  NEW_PASSWORD_LABEL,
  NEW_PASSWORD_REQUIRED,
  OTP_LABEL,
  OTP_REQUIRED,
  PASSWORD_6_CHAR,
  PASSWORDS_MUST_MATCH,
  PLACEHOLDER_CONFIRM_PASSWORD,
  PLACEHOLDER_NEW_PASSWORD,
  PLACEHOLDER_OTP,
  PLEASE_ENTER_YOUR_DETAILS_TO_UPDATE_PASS,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_TITLE,
  UPDATING,
  EMAIL_LABEL,
  PLACEHOLDER_EMAIL,
} from "../../common/constants/commonNames";

import "../../STYLE/PasswordUpdatePage.css"

const PasswordUpdatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    initialValues: {
      otp: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      otp: Yup.string().required(OTP_REQUIRED),
      email: Yup.string().email(INVALID_EMAIL).required(EMAIL_REQUIRED),
      newPassword: Yup.string()
        .min(6, PASSWORD_6_CHAR)
        .required(NEW_PASSWORD_REQUIRED),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], PASSWORDS_MUST_MATCH)
        .required(CONFIRM_PASSWORD_REQUIRED),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(`${BASEURL}${updatePasswordUrl}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.statusCode === StatusCodes.ACCEPTED) {
          toast.success(data.message);
            navigate("/login");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(ERROR_DURING_PASS_UPDATE);
      } finally {
        setLoading(false);
      }
    },
  });

  document.title = UPDATE_PASSWORD_TITLE;

  return (
    <ParticlesAuth>
      <ToastContainer />
      <div className="auth-page-content">
        <Container className="mt-4">
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Link to="/" className="d-inline-block auth-logo">
                  <img
                    src={logoLight}
                    alt="Logo"
                    className="auth-logo-img"
                  />
                </Link>
              </Box>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" className="mt-3">
            <Grid item md={8} lg={6} xl={4}>
              <Card className="mt-3 mx-auto otp-card">
                <CardContent className="p-3">
                  <Typography variant="h6" className="text-center" color="primary">
                    {UPDATE_PASSWORD}
                  </Typography>
                  <Typography variant="body2" className="text-center" color="textSecondary">
                    {PLEASE_ENTER_YOUR_DETAILS_TO_UPDATE_PASS}
                  </Typography>

                  <Box component="form" onSubmit={validation.handleSubmit}>
                    <Box mt={3} />
                    <BaseTextField
                      label={OTP_LABEL}
                      name="otp"
                      type="text"
                      placeholder={PLACEHOLDER_OTP}
                      value={validation.values.otp}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      error={validation.touched.otp && Boolean(validation.errors.otp)}
                      helperText={validation.touched.otp && validation.errors.otp}
                    />
                    <Box mt={3} />
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
                    <Box mt={3} />
                    <BaseTextField
                      label={NEW_PASSWORD_LABEL}
                      name="newPassword"
                      type="password"
                      placeholder={PLACEHOLDER_NEW_PASSWORD}
                      value={validation.values.newPassword}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      error={validation.touched.newPassword && Boolean(validation.errors.newPassword)}
                      helperText={validation.touched.newPassword && validation.errors.newPassword}
                      showPasswordToggle
                    />
                    <Box mt={3} />
                    <BaseTextField
                      label={CONFIRM_PASSWORD_LABEL}
                      name="confirmPassword"
                      type="password"
                      placeholder={PLACEHOLDER_CONFIRM_PASSWORD}
                      value={validation.values.confirmPassword}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      error={validation.touched.confirmPassword && Boolean(validation.errors.confirmPassword)}
                      helperText={validation.touched.confirmPassword && validation.errors.confirmPassword}
                      showPasswordToggle
                    />

                    <Box mt={3}>
                      <BaseButton
                        text={loading ? UPDATING : UPDATE_PASSWORD}
                        onClick={validation.handleSubmit}
                        loading={loading}
                        variant="contained"
                        color="success"
                        fullWidth
                        type="submit"
                        disabled={loading}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default withRouter(PasswordUpdatePage);
