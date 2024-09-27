import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";


//Ecommerce
import EcommerceReducer from "./ecommerce/reducer";







// Dashboard Ecommerce
import DashboardEcommerceReducer from "./dashboardEcommerce/reducer";






// File Manager




// API Key
import APIKeyReducer from "./apiKey/reducer";

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    Ecommerce: EcommerceReducer,
    DashboardEcommerce: DashboardEcommerceReducer,
    APIKey: APIKeyReducer
});

export default rootReducer;