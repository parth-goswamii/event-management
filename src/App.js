// import React from 'react';

// //import Scss
// import './assets/scss/themes.scss';

// //imoprt Route
// import Route from './Routes';

// // Import Firebase Configuration file
// // import { initFirebaseBackend } from "./helpers/firebase_helper";

// // Fake Backend 
// import fakeBackend from "./helpers/AuthType/fakeBackend";

// // Activating fake backend  
// fakeBackend();

// // const firebaseConfig = {
// //   apiKey: process.env.REACT_APP_APIKEY,
// //   authDomain: process.env.REACT_APP_AUTHDOMAIN,
// //   databaseURL: process.env.REACT_APP_DATABASEURL,
// //   projectId: process.env.REACT_APP_PROJECTID,
// //   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
// //   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
// //   appId: process.env.REACT_APP_APPID,
// //   measurementId: process.env.REACT_APP_MEASUREMENTID,
// // };

// // init firebase backend
// // initFirebaseBackend(firebaseConfig);

// function App() {
//   return (
//     <React.Fragment>
//       <Route />
//     </React.Fragment>
//   );
// }

// export default App;


import React from 'react';
import { Provider } from 'react-redux'; // Import the Provider
import {store} from './index'; // Adjust the path to your store file
import './assets/scss/themes.scss';
import Route from './Routes';
import fakeBackend from "./helpers/AuthType/fakeBackend";
import { ToastContainer } from 'react-toastify';

// Activating fake backend  
fakeBackend();

function App() {
  return (
    <Provider store={store}> {/* Wrap your Route with Provider */}
      <React.Fragment>
      <ToastContainer />
        <Route />
      </React.Fragment>
    </Provider>
  );
}

export default App;
