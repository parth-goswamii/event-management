import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { createSelector } from "reselect";
import { getItem, getItemProfileData, removeItem, setItem } from "../../common/constants/enums";
import { CHANGE_PASSWORD_TITLE, LOGOUT_TEXT, PROFILE_TEXT, USER, WELCOME_TEXT } from "../../common/constants/commonNames";
import { BASEURL, viewProfileUrl } from "../../API/api_helper";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";


const ProfileDropdown = () => {
  const navigate = useNavigate();
  const profiledropdownData = createSelector(
    (state) => state.Profile,
    (profile) => profile.user
  );

  const user = useSelector(profiledropdownData);
  const [userName, setUserName] = useState(USER);


  useEffect(() => {
    const profileData = getItemProfileData();
    if (profileData) {
      const parsedProfile = JSON.parse(profileData);
      setUserName(parsedProfile.name || USER);
    } else {
      setUserName(USER); 
    }
  }, []);
  

  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  const handleProfileClick = async () => {
    try {
      const response = await fetch(`${BASEURL}${viewProfileUrl}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: getItem(), 
          },
        }
        
      );
      
      if (response.status === StatusCodes.OK) {
        const profileData = await response.json();
        setItem('profileData', JSON.stringify(profileData.data))
        navigate("/pages-profile-settings?tab=profile");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  const handleChangePasswordClick = () => {
    navigate("/pages-profile-settings?tab=password");
  };
  const handleLogout = () => {
    localStorage.removeItem('profileData');
    removeItem('profileData')
    removeItem('authToken')
    navigate("/logout"); 
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn shadow-none">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userName}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">{WELCOME_TEXT} {userName}!</h6>
          <DropdownItem onClick={handleProfileClick}>
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">{PROFILE_TEXT}</span>
          </DropdownItem>

          <DropdownItem onClick={handleChangePasswordClick}>
            <i className="mdi mdi-lock-reset text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">{CHANGE_PASSWORD_TITLE}</span>
          </DropdownItem>

          <DropdownItem onClick={handleLogout}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle" data-key="t-logout">
              {LOGOUT_TEXT}
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
