import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; //Auth 사용
import {
    collection,
    getFirestore,
    addDoc as fsAddDoc,
    doc as fsDoc,
    onSnapshot as fsOnSnapshot,
    query,
    orderBy,
} from 'firebase/firestore';
import { DateTime } from 'luxon';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig); //firebase initialize

export const auth = getAuth();

//database init
export const db = getFirestore();

//게시물 - board collection
export const boardCollection = collection(db, 'post');
export const queryBoardCollection = query(collection(db, 'post'), orderBy('createAt', 'asc'));

export interface IPost {
    content: string;
    createUser?: string | null;
    createAt?: number;
}

const defaultPost: IPost = {
    content: '',
    createUser: 'anonymous',
    createAt: Date.now(),
};

export const addDoc = async (data: IPost) => await fsAddDoc(boardCollection, Object.assign({}, defaultPost, data));
