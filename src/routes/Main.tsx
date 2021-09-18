import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '~context/AuthContext';
import { addDoc, IBoard, queryBoardCollection } from '~firebase/board/board';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';
import ListItem from '~components/List/ListItem';

import { DocumentData, onSnapshot, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';

const Main = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);

    const [content, setContent] = useState<string>('');
    const [contentList, setContentList] = useState<IBoard[]>([]);

    useEffect(() => {
        getList();
    }, []);

    const getList = () => {
        onSnapshot(queryBoardCollection, (snapshot: QuerySnapshot<DocumentData>) => {
            const snapshotDocs = snapshot.docs as Array<QueryDocumentSnapshot<IBoard>>;

            const postList = snapshotDocs.map((doc: QueryDocumentSnapshot<IBoard>) => {
                return { ...doc.data(), docId: doc.id };
            });

            setContentList(postList);
        });
    };

    const addPost = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await addDoc({
                content: content,
                createUserId: authUser ? authUser.uid : 'anonymous',
                createUserEmail: authUser ? authUser?.email : 'anonymous',
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
        <>
            <form onSubmit={addPost}>
                <TextBox
                    onChange={onChange}
                    name="content"
                    type="text"
                    placeholder="대사를 입력 해 주셈."
                    value={content}
                />
                <Button type="submit">Go</Button>
            </form>
            {contentList.map((content: IBoard) => {
                return (
                    <ListItem
                        key={content.docId}
                        docId={content.docId}
                        content={content.content}
                        createAt={content.createAt}
                        createUserId={content.createUserId}
                        createUserEmail={content.createUserEmail}
                    />
                );
            })}
        </>
    );
};
export default Main;
