import { db } from '~firebase/firebaseInstance';
import {
    collection,
    addDoc as fsAddDoc,
    query,
    orderBy,
    where,
    deleteDoc as fsDelDoc,
    updateDoc as fsUpdateDoc,
    doc as fsDoc,
    getDocs as fsGetDocs,
} from 'firebase/firestore';

export interface IUser {
    name: string | null;
    email: string | null;
    photoUrl: string | null;
    uid: string;
}

export const userCollection = collection(db, 'user');

//const doc = (docId: IUser['docId']) => fsDoc(userCollection, docId);

export const addUser = async (data: IUser) =>
    await fsAddDoc(userCollection, Object.assign({}, data, { createAt: Date.now() }));

export const getUserInfo = async (uid: IUser['uid']) =>
    await fsGetDocs(query(userCollection, orderBy('createAt', 'desc'), where('uid', '==', uid)));
