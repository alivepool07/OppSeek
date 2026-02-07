// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKjxGHr2gvQljol7lku_IP9dIbKS3BdP4",
  authDomain: "oppseek-f1b57.firebaseapp.com",
  databaseURL: "https://oppseek-f1b57-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "oppseek-f1b57",
  storageBucket: "oppseek-f1b57.firebasestorage.app",
  messagingSenderId: "872821199205",
  appId: "1:872821199205:web:b6c4bdcffb5472c01d918c",
  measurementId: "G-4LRHH2RLPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);