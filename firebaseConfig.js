// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyApuz2jb1As_at_84x_SHgUB3xojGHnmQM",
//     authDomain: "upcaremobile.firebaseapp.com",
//     projectId: "upcaremobile",
//     storageBucket: "upcaremobile.appspot.com",
//     appId: "1:1052234263699:android:f7efdbefd83a1565617166",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBgJhIoBUAaeHNLRqrMWbyGl9kh1PAqLZE",
    authDomain: "upcaremobile.firebaseapp.com",
    projectId: "upcaremobile",
    storageBucket: "upcaremobile.appspot.com",
    messagingSenderId: "1052234263699",
    appId: "1:1052234263699:web:eeab06022a313b26617166",
    measurementId: "G-VN0K9HZ178"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Android: 916039051317-ufjrsk7ac3j0ki3lptvm0sqn03md1aje.apps.googleusercontent.com