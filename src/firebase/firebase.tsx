import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBjUjG3QFu1LtEGaakJTq6FN6Jrm2lJ-rg",
  authDomain: "ezjobs-60240.firebaseapp.com",
  databaseURL: "https://ezjobs-60240-default-rtdb.firebaseio.com",
  projectId: "ezjobs-60240",
  storageBucket: "ezjobs-60240.appspot.com",
  messagingSenderId: "1042492707043",
  appId: "1:1042492707043:web:a01d3a9d25d21772fbf5d6",
  measurementId: "G-T6RV9PSXKF"
});

export default firebase;
