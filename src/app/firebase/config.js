// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfP2Ar-3027Wx587quvFBF9iIqJEmWBPY",
  authDomain: "chord-chat.firebaseapp.com",
  projectId: "chord-chat",
  storageBucket: "chord-chat.appspot.com",
  messagingSenderId: "384604478033",
  appId: "1:384604478033:web:f0904758c873c7752c7670",
  measurementId: "G-6YFS6JNC6Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);