import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '~context/AuthContext';
import { SpinnerContext } from '~context/SpinnerContext';
import Button from '~components/Button/Button';
import TextBox from '~components/Input/TextBox';
import LabelText from '~components/Input/LabelText';
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
import styled from '@emotion/styled';

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
        <MainDiv>
            <CanvasForm onSubmit={addPost}>
                <H2>인간극장 짤 생성기</H2>
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
                    triggerFileFunc={() => imageInputRef.current?.click()}
                />
                <input
                    css={css`
                        display: none;
                    `}
                    type="file"
                    accept="image/*"
                    onChange={onChangeFile}
                    ref={imageInputRef}
                />
                <ClockDiv>
                    <input type="checkbox" {...bindVisibleTime} />
                    <LabelText
                        label="날짜"
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
                    <LabelText label="요일" name="dayOfWeek" value={dayOfWeek} onChange={onChangeInput} maxLength={1} />
                    <LabelText label="시간" name="time" value={time} onChange={onChangeInput} maxLength={2} />
                </ClockDiv>
                <SpeechDiv>
                    <LabelText label="이름(나이)" name="name" value={name} onChange={onChangeInput} maxLength={20} />
                    <input type="checkbox" {...bindVisibleJob} maxLength={15} />
                    <LabelText label="직업" name="job" value={job} onChange={onChangeInput} />
                </SpeechDiv>
                <SpeechDiv>
                    <input type="checkbox" {...bindSpeechIsQuestion} /> 질문인가요?
                    <LabelText
                        label="대사1"
                        name="speechTop"
                        value={speechTop}
                        onChange={onChangeInput}
                        maxLength={26}
                    />
                </SpeechDiv>
                <SpeechDiv>
                    <LabelText
                        label="대사2"
                        name="speechBottom"
                        value={speechBottom}
                        onChange={onChangeInput}
                        maxLength={26}
                    />
                </SpeechDiv>
                <SubmitDiv>
                    <LabelText label="작품 명" name="title" value={title} onChange={onChangeInput} />
                    <Button type="submit">Go</Button>
                </SubmitDiv>
            </CanvasForm>
            <ListDiv>
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
            </ListDiv>
        </MainDiv>
    );
};

const MainDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
`;
const CanvasForm = styled.form`
    display: flex;
    flex-direction: column;
    flex-basis: 50%;
    align-items: center;
    padding: 0em 3em 0em 3em;
`;
const ListDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-basis: 50%;
`;

const H2 = styled.h2`
    text-align: center;
`;

const ClockDiv = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const SpeechDiv = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const SubmitDiv = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

export default Main;
