import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Container,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import withRouter from "../../Components/Common/withRouter";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import logoLight from "../../assets/images/shiv_fullsize_anim.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      try { 
        const response = await fetch(
          "https://refactor-event-management.onrender.com/api/changePassword",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": localStorage.getItem("authToken")
            },
            body: JSON.stringify({
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
              confirmPassword: values.confirmPassword,
            }),
          }
        );

        const data = await response.json();
        if (data.status === "success") {
          toast.success("Password changed successfully");
          console.log("Password changed successfully");
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } else {
          toast.error(data.message || "Error changing password.");
          console.log("Error changing password:", data.message);
        }
      } catch (error) {
        toast.error("Error during password change.");
        console.error("Error during password change:", error);
      } finally {
        setLoading(false);
      }
    }
  });

  document.title = "Change Password | ShivInfotech";

  return (
    <ParticlesAuth>
      <ToastContainer />
      <div className="auth-page-content">
        <Container className="mt-4">
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "100%", width: "100%" }}>
                <Link to="/" className="d-inline-block auth-logo">
                  <img src={logoLight} alt="Logo" style={{ height: "30px", display: "block" }} />
                </Link>
              </Box>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" className="mt-4">
            <Grid item md={8} lg={6} xl={4}>
              <Card className="mt-3" sx={{ maxWidth: 450, mx: "auto" }}>
                <CardContent className="p-3">
                  <Typography variant="h6" className="text-center" color="primary">
                    Change Password
                  </Typography>
                  <Typography variant="body2" className="text-center" color="textSecondary">
                    Please enter your details to change your password.
                  </Typography>

                  <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                  }}>
                    <Box mb={2} mt={3}>
                      <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                      <TextField
                        fullWidth
                        name="currentPassword"
                        type={showPassword ? "text" : "password"}
                        size="small"
                        placeholder="Enter current password"
                        variant="outlined"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.currentPassword}
                        error={validation.touched.currentPassword && Boolean(validation.errors.currentPassword)}
                        helperText={validation.touched.currentPassword && validation.errors.currentPassword}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Box>

                    <Box mb={2}>
                      <FormLabel htmlFor="newPassword">New Password</FormLabel>
                      <TextField
                        fullWidth
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        size="small"
                        placeholder="Enter new password"
                        variant="outlined"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.newPassword}
                        error={validation.touched.newPassword && Boolean(validation.errors.newPassword)}
                        helperText={validation.touched.newPassword && validation.errors.newPassword}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Box>
                    <Box mb={2}>
                      <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                      <TextField
                        fullWidth
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        size="small"
                        placeholder="Confirm new password"
                        variant="outlined"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.confirmPassword}
                        error={validation.touched.confirmPassword && Boolean(validation.errors.confirmPassword)}
                        helperText={validation.touched.confirmPassword && validation.errors.confirmPassword}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Box>
                    <Box mt={3}>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        type="submit"
                        size="small"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                      >
                        {loading ? "Changing..." : "Change Password"}
                      </Button>
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
export default withRouter(ChangePasswordPage);
