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

    interface IFormState {
        [key: string]: string;
    }

    const initialState: IFormState = {
        day: nowDay,
        dayOfWeek: nowDayOfWeek,
        time: nowDateTime,
        title: '',
        name: '',
        job: '',
        speechTop: '',
        speechBottom: '',
    };
    const [{ day, dayOfWeek, time, title, name, job, speechTop, speechBottom }, setState] =
        useState<IFormState>(initialState);

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
            clearState();
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

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { name, value },
        } = e;
        setState(prevState => ({ ...prevState, [name]: value }));
    };

    const clearState = () => {
        setState({ ...initialState });
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
                <div>
                    <input type="file" accept="image/*" onChange={onChangeFile} ref={imageInputRef} />
                </div>
                <div>
                    작품 명 : <TextBox name="title" value={title} onChange={onChangeInput} />
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
                        날짜 :{' '}
                        <TextBox
                            name="day"
                            value={day}
                            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={onChangeInput}
                            maxLength={2}
                        />
                    </div>
                    <div>
                        요일 : <TextBox name="dayOfWeek" value={dayOfWeek} onChange={onChangeInput} maxLength={1} />
                    </div>
                    <div>
                        시간 : <TextBox name="time" value={time} onChange={onChangeInput} maxLength={2} />
                    </div>
                </div>
                <div
                    css={css`
                        padding: 1em;
                    `}
                >
                    <div>
                        이름(나이) : <TextBox name="name" value={name} onChange={onChangeInput} maxLength={20} />
                    </div>
                    <div>
                        <label>
                            <input type="checkbox" {...bindVisibleJob} maxLength={15} />
                            직업 :
                        </label>
                        <TextBox name="job" value={job} onChange={onChangeInput} />
                    </div>
                    <div>
                        대사1 : <TextBox name="speechTop" value={speechTop} onChange={onChangeInput} maxLength={26} />
                        <label>
                            <input type="checkbox" {...bindSpeechIsQuestion} /> 질문인가요?
                        </label>
                        <br />
                        대사2 :{' '}
                        <TextBox name="speechBottom" value={speechBottom} onChange={onChangeInput} maxLength={26} />
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
