// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_APIKEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.PUBLIC_FIREBASE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = 'es'; // para forzar el idioma en español

export const firebase = {
  app,
  auth,
};
