import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYJn5YoTkOGJbyXLh65EYLCBg-FMvJpy0",
  authDomain: "kustomsportsbackend.firebaseapp.com",
  projectId: "kustomsportsbackend",
  storageBucket: "kustomsportsbackend.appspot.com",
  messagingSenderId: "165123398214",
  appId: "1:165123398214:web:244122306b5445fd36c847"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);