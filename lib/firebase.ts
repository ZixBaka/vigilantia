import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBPOocTYKeISeRC-EKz68HR3qOUpy2xsG8',
  authDomain: 'vigilantia-demo.firebaseapp.com',
  projectId: 'vigilantia-demo',
  storageBucket: 'vigilantia-demo.firebasestorage.app',
  messagingSenderId: '310680380405',
  appId: '1:310680380405:ios:95fe1aa3f829743538b6bc',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
