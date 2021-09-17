import { AuthContext } from 'context/AuthContext';
import { addDoc, boardCollection, IPost, queryBoardCollection } from 'fbInstance';
import {
    DocumentData,
    DocumentSnapshot,
    onSnapshot,
    orderBy,
    QueryDocumentSnapshot,
    QuerySnapshot,
    Unsubscribe,
} from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';

const Main = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);

    const [content, setContent] = useState<string>('');
    const [contentList, setContentList] = useState<IPost[]>([]);

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        await onSnapshot(queryBoardCollection, (snapshot: QuerySnapshot<DocumentData>) => {
            const postList = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data()) as IPost[];
            setContentList(postList);
        });
    };

    const addPost = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await addDoc({
                content: content,
                createUser: authUser ? authUser?.email : 'anonymous',
            });

            setContent('');
        } catch (error) {
            console.log(error);
            console.log('add 에러 발생');
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = event;

        if (name === 'content') setContent(value);
    };

    return (
        <form onSubmit={addPost}>
            <TextBox onChange={onChange} name="content" type="text" placeholder="대사를 입력 해 주셈." />
            <Button type="submit">Go</Button>
            {contentList.map((content: IPost, index: number) => {
                return <div key={index}>{content.content}</div>;
            })}
        </form>
    );
};
export default Main;
