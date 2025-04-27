// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  GithubAuthProvider,
  sendPasswordResetEmail,onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,updateDoc,getDocs,getDoc, query, where ,deleteDoc,arrayUnion
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDj-6k9I_flC6CDyZSap5KKLKUWcJxUtr4",
  authDomain: "fir-withreact-d5a1e.firebaseapp.com",
  projectId: "fir-withreact-d5a1e",
  storageBucket: "fir-withreact-d5a1e.firebasestorage.app",
  messagingSenderId: "235829497297",
  appId: "1:235829497297:web:fe00c63f0da0d67529a4f0",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
  GithubAuthProvider,
  sendPasswordResetEmail,onAuthStateChanged,
  db,
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,updateDoc,getDocs,getDoc, query, where ,deleteDoc,arrayUnion
};
