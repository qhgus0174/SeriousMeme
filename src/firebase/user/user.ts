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
    docId: string;
    name?: string | null;
    email: string | null;
    photoUrl?: string | null;
    uid: string;
}

export const userCollection = collection(db, 'user');

const doc = (docId: IUser['docId']) => fsDoc(userCollection, docId);

export const addUser = async (data: Omit<IUser, 'docId'>) =>
    await fsAddDoc(userCollection, Object.assign({}, data, { createAt: Date.now() }));

export const getUserInfo = async (uid: IUser['uid']) =>
    await fsGetDocs(query(userCollection, orderBy('createAt', 'desc'), where('uid', '==', uid)));

export const getUserDocId = async (uid: IUser['uid']): Promise<string> => {
    return new Promise(async resolve => {
        const userInfo = (await fsGetDocs(query(userCollection, orderBy('createAt', 'desc'), where('uid', '==', uid))))
            .docs;
        let docId = '';
        userInfo.forEach(doc => {
            docId = doc.id;
        });

        resolve(docId);
    });
};

export const updateUserInfo = async (uid: IUser['uid'], { name, photoUrl }: Pick<IUser, 'name' | 'photoUrl'>) => {
    getUserDocId(uid).then(async (docId: string) => {
        await fsUpdateDoc(doc(docId), { name, photoUrl });
    });
};
