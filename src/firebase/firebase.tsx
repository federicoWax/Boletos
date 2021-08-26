import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

import { FirestoreReducer } from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from "redux-firestore";
import { createStore, combineReducers } from 'redux';
export interface RootState {
  firestore: FirestoreReducer.Reducer
}

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

firebase.firestore();

const rootReducer = combineReducers<RootState>({
  firestore: firestoreReducer 
})

const store = createStore(rootReducer, {});

const rrfProps = {
  firebase,
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true 
  },
  dispatch: store.dispatch,
  createFirestoreInstance 
};

export { store, rrfProps };
export default firebase;
