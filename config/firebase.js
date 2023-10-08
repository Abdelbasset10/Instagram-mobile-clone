// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB-YeWelh7XqwnogRbTJfWnZIYAAeZ933I',
  authDomain: 'instagram-clone-d8184.firebaseapp.com',
  projectId: 'instagram-clone-d8184',
  storageBucket: 'instagram-clone-d8184.appspot.com',
  messagingSenderId: '490169588811',
  appId: '1:490169588811:web:386f5eda2baa2ae62c01ce',
  measurementId: 'G-WR7MDWY9C2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
