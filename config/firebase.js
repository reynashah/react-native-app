// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGGSd_UTsQ71yxhu4hlj4ksPbu5B20AIs",
  authDomain: "user-auth-52602.firebaseapp.com",
  projectId: "user-auth-52602",
  storageBucket: "user-auth-52602.appspot.com",
  messagingSenderId: "2490057946",
  appId: "1:2490057946:web:512b7461e37fb67435d1e3"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);