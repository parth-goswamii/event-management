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
import { getItem } from "../../common/constants/enums";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const profiledropdownData = createSelector(
    (state) => state.Profile,
    (profile) => profile.user
  );

  const user = useSelector(profiledropdownData);
  const [userName, setUserName] = useState("USER");

  // useEffect(() => {
  //   if (user && Object.keys(user).length > 0) {
  //     setUserName(user.first_name || user.username || "Admin");
  //   } else if (sessionStorage.getItem("authUser")) {
  //     const obj = JSON.parse(sessionStorage.getItem("authUser"));
  //     setUserName(obj.email || "Admin");
  //   }
  // }, [user]);

  useEffect(() => {
    const profileData = localStorage.getItem('profileData');
    if (profileData) {
      const parsedProfile = JSON.parse(profileData);
      setUserName(parsedProfile.name || "USER"); // Assuming `name` is the field in profileData
    } else {
      setUserName("USER"); // Fallback if profile data isn't in local storage
    }
  }, []);
  

  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  const handleProfileClick = async () => {
    try {
      const response = await fetch(
        "https://refactor-event-management.onrender.com/api/viewProfile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: getItem(), // Assuming you have a token stored
          },
        }
        
      );
      
      if (response.ok) {
        const profileData = await response.json();
        localStorage.setItem('profileData', JSON.stringify(profileData.data));
        navigate("/pages-profile-settings?tab=profile");
      } else {
        console.error("Failed to fetch profile data.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChangePasswordClick = () => {
    navigate("/pages-profile-settings?tab=password");
  };
  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('profileData');
    localStorage.removeItem('authToken'); // If you also want to clear session data
    navigate("/logout"); // Redirect to logout or home page
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
          <h6 className="dropdown-header">Welcome {userName}!</h6>
          <DropdownItem onClick={handleProfileClick}>
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Profile</span>
          </DropdownItem>

          <DropdownItem onClick={handleChangePasswordClick}>
            <i className="mdi mdi-lock-reset text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle">Change Password</span>
          </DropdownItem>

          <DropdownItem onClick={handleLogout}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
