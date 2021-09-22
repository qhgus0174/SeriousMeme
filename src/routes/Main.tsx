import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '~context/AuthContext';
import { SpinnerContext } from '~context/SpinnerContext';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';
import ListItem from '~components/List/ListItem';
import Canvas from '~components/Canvas/canvas';

import { getDownloadURL } from '@firebase/storage';
import { DocumentData, onSnapshot, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { addDoc, IBoard, queryBoardCollection } from '~firebase/board/board';
import { uploadByAttachmentUrlBoard } from '~firebase/storage/storage';

import { css } from '@emotion/react';

import { useInput } from '~hooks/useInput';
import { useCheckbox } from '~hooks/useCheckbox';

import { nowDateTime, nowDay, nowDayOfWeek } from '~utils/luxon';

const Main = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);

    const { setSpinnerVisible } = useContext(SpinnerContext);

    const [day, bindDay] = useInput<string>(nowDay, { numberOnly: true, maxLength: 2 });
    const [dayOfWeek, bindDayOfWeek] = useInput<string>(nowDayOfWeek, { maxLength: 1 });
    const [time, bindTime] = useInput<string>(nowDateTime, { maxLength: 2 });
    const [title, bindTitle] = useInput<string>('');
    const [name, bindName] = useInput<string>('', { maxLength: 20 });
    const [job, bindJob] = useInput<string>('', { maxLength: 15 });
    const [speechTop, bindSpeechTop] = useInput<string>('', { maxLength: 26 });
    const [speechBottom, bindSpeechBottom] = useInput<string>('', { maxLength: 26 });

    const [visibleTime, bindVisibleTime] = useCheckbox(true);
    const [visibleJob, bindVisibleJob] = useCheckbox(true);
    const [speechIsQuestion, bindSpeechIsQuestion] = useCheckbox(true);

    const [contentList, setContentList] = useState<IBoard[]>([]);
    const [attachment, setAttachment] = useState<string>('');
    const [newAttachment, setNewAttachment] = useState<string>('');

    const imageInputRef = useRef<HTMLInputElement>(null);

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
            if (attachment && newAttachment) {
                const res = await uploadByAttachmentUrlBoard(authUser ? authUser.uid : 'anonymous', newAttachment);
                attatchmentUrl = await getDownloadURL(res.ref);
            }
            await addDoc({
                content: title,
                createUserId: authUser ? authUser.uid : 'anonymous',
                createUserEmail: authUser ? authUser?.email : 'anonymous',
                attatchmentUrl: attatchmentUrl,
            });
            setAttachment('');
            setNewAttachment('');
            if (imageInputRef.current) imageInputRef.current.value = '';
        } catch (error) {
            console.log(error);
            console.log('add 에러 발생');
        } finally {
            setSpinnerVisible(false);
        }
    };

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            const renderResult = reader.result;
            if (renderResult instanceof ArrayBuffer || renderResult == null) return;
            setAttachment(renderResult);
        };
    };

    return (
        <>
            <form onSubmit={addPost}>
                <Canvas
                    imageUrl={attachment}
                    text={{
                        clock: { visible: visibleTime, day: day, dayOfWeek: dayOfWeek, time: time },
                        script: {
                            name: name,
                            job: { visible: visibleJob, jobName: job },
                            speech: {
                                top: {
                                    isQuestion: speechIsQuestion,
                                    text: speechTop,
                                },
                                bottom: speechBottom,
                            },
                        },
                    }}
                    setNewAttachment={setNewAttachment}
                />
                {/* {attachment && (
                    <div>
                        <img src={attachment} width="30%" height="30%" />
                        <Button onClick={() => setAttachment('')}>Clear</Button>
                    </div>
                )} */}
                <div>
                    <input type="file" accept="image/*" onChange={onChangeFile} ref={imageInputRef} />
                </div>
                <div>
                    작품 명 : <TextBox {...bindTitle} />
                </div>
                <div
                    css={css`
                        padding: 1em;
                    `}
                >
                    <label>
                        <input type="checkbox" {...bindVisibleTime} /> 시계 보이기
                    </label>
                    <div>
                        날짜 : <TextBox {...bindDay} />
                    </div>
                    <div>
                        요일 : <TextBox {...bindDayOfWeek} />
                    </div>
                    <div>
                        시간 : <TextBox {...bindTime} />
                    </div>
                </div>
                <div
                    css={css`
                        padding: 1em;
                    `}
                >
                    <div>
                        이름(나이) : <TextBox {...bindName} />
                    </div>
                    <div>
                        <label>
                            <input type="checkbox" {...bindVisibleJob} />
                            직업 :
                        </label>
                        <TextBox {...bindJob} />
                    </div>
                    <div>
                        대사1 : <TextBox {...bindSpeechTop} />
                        <label>
                            <input type="checkbox" {...bindSpeechIsQuestion} /> 질문인가요?
                        </label>
                        <br />
                        대사2 : <TextBox {...bindSpeechBottom} />
                    </div>
                </div>
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
