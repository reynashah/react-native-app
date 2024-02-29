// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  collectionGroup,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from 'firebase/firestore'

// Firebase configuration for the first project
const firebaseConfig = {
  apiKey: "AIzaSyCGGSd_UTsQ71yxhu4hlj4ksPbu5B20AIs",
  authDomain: "user-auth-52602.firebaseapp.com",
  projectId: "user-auth-52602",
  storageBucket: "user-auth-52602.appspot.com",
  messagingSenderId: "2490057946",
  appId: "1:2490057946:web:512b7461e37fb67435d1e3"
};

// Initialize Firebase for the first project
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Export db for Firestore
if (!getApps().length) initializeApp(firebaseConfig)

export {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  collection,
  collectionGroup,
  addDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  getDoc,
  getDocs,
  setDoc,
  doc,
  arrayUnion,
  arrayRemove,
  updateDoc,
}

