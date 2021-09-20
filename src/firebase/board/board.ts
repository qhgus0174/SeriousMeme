import { db } from '~firebase/firebaseInstance';
import {
    collection,
    addDoc as fsAddDoc,
    query,
    orderBy,
    deleteDoc as fsDelDoc,
    updateDoc as fsUpdateDoc,
    doc as fsDoc,
} from 'firebase/firestore';

export interface IBoard {
    docId: string;
    content: string;
    createUserId?: string | null;
    createUserEmail?: string | null;
    createAt?: number;
    attatchmentUrl?: string | null;
}

//게시물 - board collection
export const boardCollection = collection(db, 'board');
export const queryBoardCollection = query(collection(db, 'board'), orderBy('createAt', 'asc'));

const doc = (docId: IBoard['docId']) => fsDoc(boardCollection, docId);

export const addDoc = async (data: Omit<IBoard, 'docId'>) =>
    await fsAddDoc(boardCollection, Object.assign({}, data, { createAt: Date.now() }));

export const updateDoc = async (docId: IBoard['docId'], content: IBoard['content']) =>
    await fsUpdateDoc(doc(docId), { content: content, createAt: Date.now() });

export const deleteDoc = async (docId: IBoard['docId']) => await fsDelDoc(doc(docId));
