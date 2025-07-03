import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAUn0TEjmI_Kv6N_v_XVvVbnzPfFwhltjk",
  authDomain: "resumeranker-618a3.firebaseapp.com",
  projectId: "resumeranker-618a3",
  storageBucket: "resumeranker-618a3.firebasestorage.app",
  messagingSenderId: "412559971444",
  appId: "1:412559971444:web:fd46b78de99c23ff69ad21"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
