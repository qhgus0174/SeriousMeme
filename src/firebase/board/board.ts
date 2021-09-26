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
    limit,
    QuerySnapshot,
    QueryDocumentSnapshot,
} from 'firebase/firestore';

export interface IBoard {
    id: number;
    docId: string;
    content: string;
    createUserId: string;
    createUserEmail?: string | null;
    createAt?: number;
    attatchmentUrl?: string | null;
}

//게시물 - board collection
export const boardCollection = collection(db, 'board');
export const queryBoardCollection = query(boardCollection, orderBy('createAt', 'desc'));

const doc = (docId: IBoard['docId']) => fsDoc(boardCollection, docId);

export const getBoardData = async () => await fsGetDocs(query(boardCollection, orderBy('id', 'desc')));
export const getBoardCount = async () => (await fsGetDocs(boardCollection)).size;

export const addDoc = async (data: Omit<IBoard, 'docId' | 'id'>) => {
    getMaxIndex().then(async (maxId: number) => {
        await fsAddDoc(boardCollection, Object.assign({}, data, { id: maxId + 1, createAt: Date.now() }));
    });
};

export const updateDoc = async (docId: IBoard['docId'], content: IBoard['content']) =>
    await fsUpdateDoc(doc(docId), { content: content, createAt: Date.now() });

export const deleteDoc = async (docId: IBoard['docId']) => await fsDelDoc(doc(docId));

export const getMyDocs = async (createUserId: string) =>
    await fsGetDocs(query(boardCollection, orderBy('createAt', 'desc'), where('createUserId', '==', createUserId)));

export const getMaxIndex = (): Promise<number> => {
    return new Promise(async resolve => {
        const docs = (await fsGetDocs(
            query(boardCollection, orderBy('id', 'desc'), limit(1)),
        )) as QuerySnapshot<IBoard>;
        let maxId = 0;
        docs.forEach((doc: QueryDocumentSnapshot<IBoard>) => {
            maxId = doc.data().id;
        });

        resolve(maxId);
    });
};
