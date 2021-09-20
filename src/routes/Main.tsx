import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '~context/AuthContext';
import { addDoc, IBoard, queryBoardCollection } from '~firebase/board/board';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';
import ListItem from '~components/List/ListItem';

import { DocumentData, onSnapshot, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { SpinnerContext } from '~context/SpinnerContext';
import { uploadByAttachmentUrl } from '~firebase/storage/storage';
import { getDownloadURL } from '@firebase/storage';

const Main = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);

    const { setSpinnerVisible } = useContext(SpinnerContext);

    const [content, setContent] = useState<string>('');
    const [contentList, setContentList] = useState<IBoard[]>([]);
    const [attachment, setAttachment] = useState<string | null>(null);

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
        setSpinnerVisible(true);
        try {
            let attatchmentUrl: string | null = null;

            if (attachment) {
                const res = await uploadByAttachmentUrl(authUser ? authUser.uid : 'anonymous', attachment);
                attatchmentUrl = await getDownloadURL(res.ref);
            }

            await addDoc({
                content: content,
                createUserId: authUser ? authUser.uid : 'anonymous',
                createUserEmail: authUser ? authUser?.email : 'anonymous',
                attatchmentUrl: attatchmentUrl,
            });

            setContent('');
            setAttachment(null);
        } catch (error) {
            console.log(error);
            console.log('add 에러 발생');
        } finally {
            setSpinnerVisible(false);
        }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = event;

        if (name === 'content') setContent(value);
    };

    const onClickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if (!files) {
            return;
        }
        const file = files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            if (reader.result instanceof ArrayBuffer) return;
            setAttachment(reader.result);
        };
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
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <Button onClick={() => setAttachment(null)}>Clear</Button>
                    </div>
                )}
                <input type="file" accept="image/*" onChange={onClickFile} />

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
                        attatchmentUrl={content.attatchmentUrl}
                    />
                );
            })}
        </>
    );
};
export default Main;
