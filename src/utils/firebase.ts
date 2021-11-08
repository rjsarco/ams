import firebase from "firebase/compat/app";

import {
  getFirestore,
  connectFirestoreEmulator,
  getDoc,
  doc,
  collection,
  DocumentData
} from "firebase/firestore";

const config = {
  projectId: 'test',
  appId: 'test',
  databaseURL: '',
  storageBucket: '',
  locationId: '',
  apiKey: '',
  authDomain: '',
  messagingSenderId: '',
}

const app = firebase.initializeApp(config);

const db = getFirestore(app);
const [host, port] = process.env.REACT_APP_FIRESTORE_EMULATOR_HOST!.split(':');
connectFirestoreEmulator(db, host, +port);

export default db;
