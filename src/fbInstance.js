import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; //Auth 사용

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID,
};

initializeApp(firebaseConfig); //firebase init

export const authService = getAuth(); //인증 서비스 가져오기
