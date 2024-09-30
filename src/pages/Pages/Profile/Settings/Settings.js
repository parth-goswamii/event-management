  import React, { useState, useEffect } from "react";
  import { useSearchParams } from "react-router-dom";
  import { useNavigate } from "react-router-dom";
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
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import { toast } from "react-toastify";
  import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
  import {
    NAME,
    PHONE_NUMBER,
    EMAIL_LABEL,
    PROFILE_INFORMATION,
    PROFILE_VALUE,
    PASSWORD_VALUE,
    CHANGE_PASSWORD_TITLE,
    CHANGE_PASSWORD_BUTTON,
    CURRENT_PASSWORD_LABEL,
    NEW_PASSWORD_LABEL,
    CONFIRM_PASSWORD_LABEL,
    CURRENT_PASSWORD_IS_REQUIRED,
    PASSWORD_6_CHAR,
    NEW_PASSWORD_REQUIRED,
    PASSWORDS_MUST_MATCH,
    CONFIRM_PASSWORD_REQUIRED,
    ENTER_YOUR_NAME,
    ENTER_YOUR_PHONE_NUMBER,
    ENTER_YOUR_EMAIL_ADDRESS,
    ENTER_CURRENT_PASSWORD,
    ENTER_NEW_PASSWORD,
    CONFIRM_NEW_PASSWORD,
    EMPTY_STRING,
    TAB_VALUE,
    PROFILE_IMAGE,
    PROFILE_DATA,
    UPLOAD_PHOTO,
    USER,
    USER_MAIL_EXAMPLE,
    PASSWORD_8_CHAR,
    PASSWORD_CAPITAL_MESSAGE,
    NAME_IS_REQUIRED,
    NAME_VALIDATION,
    PLEASE_ENTER_VALID_EMAIL_ADDRESS,
    EMAIL_IS_REQUIRED,
    VALIDATION_ERROR,
    PHONE_NUMBER_IS_REQUIRED,
    PHONE_NUMBER_MUST_BE_ONLY_DIGITS,
    PHONE_NUMBER_10,
    SAVE,
  } from "../../../../common/constants/commonNames";
  import BaseTextField from "../../../../common/components/BaseTextField";
  import BaseButton from "../../../../common/components/BaseButton";
  import "../../../../STYLE/Settings.css";
  import {
    getItem,
    getItemProfileData,
    setItem,
  } from "../../../../common/constants/enums";
  import {
    BASEURL,
    changePasswordUrl,
    editProfileUrl,
  } from "../../../../API/api_helper";
  import { StatusCodes } from "http-status-codes";

  const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
      name: EMPTY_STRING,
      email: EMPTY_STRING,
      phone_number: EMPTY_STRING,
    });
    const [activeTab, setActiveTab] = useState(PROFILE_VALUE);
    const [isDirty, setIsDirty] = useState(false);
    const [searchParams] = useSearchParams();

    const tab = searchParams.get(TAB_VALUE);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProfileData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      const originalProfileData = JSON.parse(getItemProfileData());
      const isProfileChanged = value !== originalProfileData[name];
      setIsDirty(isProfileChanged);
    };

    const validation = useFormik({
      initialValues: {
        currentPassword: EMPTY_STRING,
        newPassword: EMPTY_STRING,
        confirmPassword: EMPTY_STRING,
        name: EMPTY_STRING,
        email: EMPTY_STRING,
        phone_number: EMPTY_STRING,
      },
      validationSchema: Yup.object({
        name: Yup.string().required(NAME_IS_REQUIRED).min(2, NAME_VALIDATION),

        email: Yup.string()
          .email(PLEASE_ENTER_VALID_EMAIL_ADDRESS)
          .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, PLEASE_ENTER_VALID_EMAIL_ADDRESS)
          .required(EMAIL_IS_REQUIRED),

        phone_number: Yup.string()
          .required(PHONE_NUMBER_IS_REQUIRED)
          .matches(/^[0-9]+$/, PHONE_NUMBER_MUST_BE_ONLY_DIGITS)
          .min(10, PHONE_NUMBER_10),

        currentPassword: Yup.string()
          .required(CURRENT_PASSWORD_IS_REQUIRED)
          .min(8, PASSWORD_8_CHAR)
          .matches(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            PASSWORD_CAPITAL_MESSAGE
          ),

        newPassword: Yup.string()
          .required(NEW_PASSWORD_REQUIRED)
          .min(8, PASSWORD_8_CHAR)
          .matches(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            PASSWORD_CAPITAL_MESSAGE
          ),

        confirmPassword: Yup.string()
          .required(CONFIRM_PASSWORD_REQUIRED)
          .min(8, PASSWORD_8_CHAR)
          .oneOf([Yup.ref("newPassword"), null], PASSWORDS_MUST_MATCH),
      }),
      onSubmit: async (values) => {
        setLoading(true);
        try {
          const response = await fetch(`${BASEURL}${changePasswordUrl}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: getItem(),
            },
            body: JSON.stringify(values),
          });

          const result = await response.json();
          if (result.statusCode === StatusCodes.ACCEPTED) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      },
    });

    const handleSave = async () => {
      setLoading(true);
      try {

        validation.setFieldValue('name', profileData.name);
        validation.setFieldValue('email', profileData.email);
        validation.setFieldValue('phone_number', profileData.phone_number);

        if(await validation.validateForm()){
        const response = await fetch(`${BASEURL}${editProfileUrl}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: getItem(),
          },
          body: JSON.stringify(profileData),
        });
        const result = await response.json();

        if (result.statusCode === StatusCodes.ACCEPTED) {
          toast.success(result.message);
          setItem(PROFILE_DATA, JSON.stringify(profileData));
          setProfileData({ ...profileData });
          setIsDirty(false);
        } else {
          toast.error(result.message);
        }
      } else {
        toast.error(VALIDATION_ERROR);
      }}
      catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };



    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append(PROFILE_IMAGE, file);

        try {
          const response = await fetch(`${BASEURL}${editProfileUrl}`, {
            method: "PUT",
            headers: {
              Authorization: getItem(),
            },
            body: formData,
          });

          const result = await response.json();
          if (result.statusCode === StatusCodes.OK) {
            toast.success(result.message);
            const updatedProfileData = {
              ...profileData,
              profile_image: URL.createObjectURL(file),
            };
            setProfileData(updatedProfileData);
            setItem(PROFILE_DATA, JSON.stringify(updatedProfileData));
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    };

    useEffect(() => {
      const savedProfile = getItemProfileData();
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setProfileData({
            name: profile.name || EMPTY_STRING,
            email: profile.email || EMPTY_STRING,
            phone_number: profile.phone_number || EMPTY_STRING,
            profile_image: profile.profile_image || avatar1,
          });
        } catch (error) {
          toast.error(error.message);
        }
      }

      if (tab === PASSWORD_VALUE) {
        setActiveTab(PASSWORD_VALUE);
      } else {
        setActiveTab(PROFILE_VALUE);
      }
    }, [tab]);

    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
    };

    return (
      <Container maxWidth="md" className="container">
        <Card sx={{ marginBottom: 1 }}>
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={2}
              mt={7}
            >
              <Box position="relative">
                <img
                  src={profileData.profile_image || avatar1}
                  alt="User Avatar"
                  className="avatar"
                />
                <input
                  type="file"
                  accept="image/jpeg"
                  id="upload-photo"
                  className="hidden-input"
                  onChange={handleFileChange}
                />

                <IconButton
                  className="icon-button"
                  onClick={() => document.getElementById(UPLOAD_PHOTO).click()}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography variant="h6">{profileData.name || USER}</Typography>
              <Typography variant="body2" color="textSecondary">
                {profileData.email || USER_MAIL_EXAMPLE}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={PROFILE_INFORMATION} value={PROFILE_VALUE} />
              <Tab label={CHANGE_PASSWORD_TITLE} value={PASSWORD_VALUE} />
            </Tabs>

            {activeTab === PROFILE_VALUE && (
              <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" className="profile-title">
                    {PROFILE_INFORMATION}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <BaseTextField
                    label={NAME}
                    placeholder={ENTER_YOUR_NAME}
                    name="name"
                    size="small"
                    className="text-field"
                    value={profileData.name}
                    onChange={handleInputChange}
                    error={
                      validation.touched.name && Boolean(validation.errors.name)
                    }
                    helperText={
                      validation.touched.name && validation.errors.name
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <BaseTextField
                    label={PHONE_NUMBER}
                    placeholder={ENTER_YOUR_PHONE_NUMBER}
                    name="phone_number"
                    size="small"
                    className="text-field"
                    value={profileData.phone_number}
                    onChange={handleInputChange}
                    error={
                      validation.touched.phone_number && Boolean(validation.errors.phone_number)
                    }
                    helperText={
                      validation.touched.phone_number && validation.errors.phone_number
                    }
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
                    value={profileData.email}
                    onChange={handleInputChange}
                    error={
                      validation.touched.email && Boolean(validation.errors.email)
                    }
                    helperText={
                      validation.touched.email && validation.errors.email
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <BaseButton
                    text={loading ? "" : SAVE}
                    loading={loading}
                    disabled={!isDirty}
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    fullWidth
                  />

                </Grid>
              </Grid>
            )}

            {activeTab === PASSWORD_VALUE && (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                }}
                sx={{ marginTop: 1 }}
              >
                <Typography variant="h6" className="profile-title">
                  {CHANGE_PASSWORD_TITLE}
                </Typography>

                <BaseTextField
                  label={CURRENT_PASSWORD_LABEL}
                  name="currentPassword"
                  type="password"
                  placeholder={ENTER_CURRENT_PASSWORD}
                  size="small"
                  onChange={validation.handleChange}
                  value={validation.values.currentPassword}
                  onBlur={validation.handleBlur}
                  error={
                    validation.touched.currentPassword &&
                    Boolean(validation.errors.currentPassword)
                  }
                  helperText={
                    validation.touched.currentPassword &&
                    validation.errors.currentPassword
                  }
                  showPasswordToggle
                />
                <BaseTextField
                  label={NEW_PASSWORD_LABEL}
                  name="newPassword"
                  type="password"
                  placeholder={ENTER_NEW_PASSWORD}
                  size="small"
                  onChange={validation.handleChange}
                  value={validation.values.newPassword}
                  onBlur={validation.handleBlur}
                  error={
                    validation.touched.newPassword &&
                    Boolean(validation.errors.newPassword)
                  }
                  helperText={
                    validation.touched.newPassword &&
                    validation.errors.newPassword
                  }
                  showPasswordToggle
                />
                <BaseTextField
                  label={CONFIRM_PASSWORD_LABEL}
                  name="confirmPassword"
                  type="password"
                  placeholder={CONFIRM_NEW_PASSWORD}
                  size="small"
                  onChange={validation.handleChange}
                  value={validation.values.confirmPassword}
                  onBlur={validation.handleBlur}
                  error={
                    validation.touched.confirmPassword &&
                    Boolean(validation.errors.confirmPassword)
                  }
                  helperText={
                    validation.touched.confirmPassword &&
                    validation.errors.confirmPassword
                  }
                  showPasswordToggle
                />

                <BaseButton
                  text={loading ? EMPTY_STRING : CHANGE_PASSWORD_BUTTON}
                  loading={loading}
                  variant="contained"
                  color="success"
                  fullWidth
                  type="submit"
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    );
  };

  export default Settings;
