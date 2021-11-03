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
