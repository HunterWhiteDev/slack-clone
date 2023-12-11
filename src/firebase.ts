import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import "firebase/firestore";
import "firebase/functions";
const firebaseKeys = require("./firebaseKeys");

const firebaseConfig = firebaseKeys;

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const functions = getFunctions(app, "us-central1");
export const signInWithEmail = signInWithEmailAndPassword;
export const signUp = createUserWithEmailAndPassword;
export const authChange = onAuthStateChanged;
export const logOut = signOut;
const db = getFirestore(app);
export default db;
