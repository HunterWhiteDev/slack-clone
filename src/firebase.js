// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCPccz8CIjAZvlChzDMscHC3OAruS1B_7g",
  authDomain: "slack-clone-5e6e1.firebaseapp.com",
  databaseURL: "https://slack-clone-5e6e1.firebaseio.com",
  projectId: "slack-clone-5e6e1",
  storageBucket: "slack-clone-5e6e1.appspot.com",
  messagingSenderId: "75612150169",
  appId: "1:75612150169:web:c54bc0e4aa365450a01b08",
  measurementId: "G-4L0SBG2XRB",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
