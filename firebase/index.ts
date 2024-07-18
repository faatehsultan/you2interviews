import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYoP6SNB60vUwo_WeGkTfPg-X0ENTKsgk",
  authDomain: "temp-9cce8.firebaseapp.com",
  projectId: "temp-9cce8",
  storageBucket: "temp-9cce8.appspot.com",
  messagingSenderId: "729938612229",
  appId: "1:729938612229:web:6dd195e08c99b91ce40c6c",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
