import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Box,
    IconButton,
    Tabs,
    Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import avatar1 from '../../../../assets/images/users/avatar-1.jpg';
import { 
    SETTINGS_TITLE, 
    CURRENT_PASSWORD_LABEL, 
    NEW_PASSWORD_LABEL, 
    CONFIRM_PASSWORD_LABEL, 
    CHANGE_PASSWORD_BUTTON, 
    CHANGING_PASSWORD_TEXT, 
    CHANGE_PASSWORD_TITLE,
    CURRENT_PASSWORD_IS_REQUIRED,
    PASSWORD_6_CHAR,
    NEW_PASSWORD_REQUIRED,
    PASSWORDS_MUST_MATCH,
    CONFIRM_PASSWORD_REQUIRED,
    USER,
    USER_MAIL_EXAMPLE,
    PROFILE_VALUE,
    PROFILE_INFORMATION,
    PASSWORD_VALUE,
    YOUR_NAME,
    ENTER_YOUR_NAME,
    NAME,
    PHONE_NUMBER,
    ENTER_YOUR_PHONE_NUMBER,
    EMAIL_LABEL,
    ENTER_YOUR_EMAIL_ADDRESS,
    ENTER_CURRENT_PASSWORD,
    ENTER_NEW_PASSWORD,
    CONFIRM_NEW_PASSWORD
} from "../../../../common/constants/commonNames";
import { BASEURL, changePasswordUrl } from '../../../../API/api_helper';
import { getItem } from '../../../../common/constants/enums';
import { StatusCodes } from "http-status-codes";
import "../../../../STYLE/Settings.css"
import BaseTextField from '../../../../common/components/BaseTextField';
import BaseButton from '../../../../common/components/BaseButton';


const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    document.title = SETTINGS_TITLE; 

    const validation = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required(CURRENT_PASSWORD_IS_REQUIRED),
            newPassword: Yup.string().min(6, PASSWORD_6_CHAR).required(NEW_PASSWORD_REQUIRED),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], PASSWORDS_MUST_MATCH)
                .required(CONFIRM_PASSWORD_REQUIRED),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await fetch(`${BASEURL}${changePasswordUrl}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": getItem(),
                        },
                        body: JSON.stringify({
                            currentPassword: values.currentPassword,
                            newPassword: values.newPassword,
                            confirmPassword: values.confirmPassword,
                        }),
                    }  
                );
                
                const data = await response.json();
                if (data.statusCode === StatusCodes.ACCEPTED) {
                    toast.success(data.message);
                    navigate("/dashboard");
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        },
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="md" className="container">
            <ToastContainer />
            <Card sx={{ marginBottom: 1 }}>
                <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2} mt={7}>
                        <Box position="relative">
                            <img src={avatar1} alt="User Avatar" className="avatar" />
                            <IconButton
                                className="icon-button"
                                component={Link} to="/edit-profile"
                            >
                                <EditIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h6">{USER}</Typography>
                        <Typography variant="body2" color="textSecondary">{USER_MAIL_EXAMPLE}</Typography>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                        <Tab label={PROFILE_INFORMATION} value={PROFILE_VALUE} />
                        <Tab label={CHANGE_PASSWORD_TITLE} value={PASSWORD_VALUE} />
                    </Tabs>

                    {activeTab === PROFILE_VALUE && (
                        <Grid container spacing={2} sx={{ marginTop: 1 }}>
                            <Grid item xs={12}>
                                <Typography variant="h6" className="profile-title">{PROFILE_INFORMATION}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BaseTextField
                                    label={NAME}
                                    placeholder= {ENTER_YOUR_NAME}
                                    name="Name"
                                    size="small"
                                    className="text-field"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BaseTextField
                                    label={PHONE_NUMBER}
                                    placeholder={ENTER_YOUR_PHONE_NUMBER}
                                    name="phone number"
                                    size="small"
                                    className="text-field"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BaseTextField
                                    type="email"
                                    label={EMAIL_LABEL}
                                    placeholder={ENTER_YOUR_EMAIL_ADDRESS}
                                    name="email"
                                    size="small"
                                    className="text-field"
                                />
                            </Grid>
                        </Grid>
                        
                    )}

                    {activeTab === PASSWORD_VALUE && (
                        <Box component="form" onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                        }} sx={{ marginTop: 1 }}>
                            <Typography variant="h6" className="profile-title">
                                {CHANGE_PASSWORD_TITLE}
                            </Typography>

                            <Box sx={{ marginBottom: 2 }}> 
                                <BaseTextField

                                    label={CURRENT_PASSWORD_LABEL}
                                    name="currentPassword"
                                    type="password"
                                    size="small"
                                    placeholder={ENTER_CURRENT_PASSWORD}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.currentPassword}
                                    error={validation.touched.currentPassword && Boolean(validation.errors.currentPassword)}
                                    helperText={validation.touched.currentPassword && validation.errors.currentPassword}
                                    showPasswordToggle
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <BaseTextField
                                    label={NEW_PASSWORD_LABEL}
                                    name="newPassword"
                                    type="password"
                                    size="small"
                                    placeholder={ENTER_NEW_PASSWORD}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.newPassword}
                                    error={validation.touched.newPassword && Boolean(validation.errors.newPassword)}
                                    helperText={validation.touched.newPassword && validation.errors.newPassword}
                                    showPasswordToggle
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}> 
                                <BaseTextField
                                    label={CONFIRM_PASSWORD_LABEL}
                                    name="confirmPassword"
                                    type="password"
                                    size="small"
                                    placeholder={CONFIRM_NEW_PASSWORD}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.confirmPassword}
                                    error={validation.touched.confirmPassword && Boolean(validation.errors.confirmPassword)}
                                    helperText={validation.touched.confirmPassword && validation.errors.confirmPassword}
                                    showPasswordToggle
                                />
                            </Box>

                            <Box>
                                <BaseButton
                                    text={loading ? CHANGING_PASSWORD_TEXT : CHANGE_PASSWORD_BUTTON}
                                    loading={loading}
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    type="submit"
                                />
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default Settings;
