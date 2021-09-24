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

import { nowDateTime, nowDateToMillis, nowDay, nowDayOfWeek } from '~utils/luxon';
import styled from '@emotion/styled';
import Checkbox from '~components/Input/Checkbox';
import SvgIcon from '~components/Icon/SvgIcon';

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
    const [newAttachment, setNewAttachment] = useState<string>('');

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
            if (newAttachment) {
                const res = await uploadByAttachmentUrlBoard(authUser ? authUser.uid : 'anonymous', newAttachment);
                attatchmentUrl = await getDownloadURL(res.ref);
            }
            await addDoc({
                content: title,
                createUserId: authUser ? authUser.uid : 'anonymous',
                createUserEmail: authUser ? authUser?.email : 'anonymous',
                attatchmentUrl: attatchmentUrl,
            });
            setNewAttachment('');
            //clearState();
            //if (imageInputRef.current) imageInputRef.current.value = '';
        } catch (error) {
            console.log(error);
            console.log('add 에러 발생');
        } finally {
            setSpinnerVisible(false);
        }
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

    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const onClickDownload = () => {
        var a = document.createElement('a');
        a.download = `${nowDateToMillis}.png`;
        a.href = downloadUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <MainDiv>
            <CanvasForm onSubmit={addPost}>
                <CanvasButtonsDiv>
                    <Button color="main" type="submit">
                        자랑하기
                    </Button>
                    <DownloadButton
                        type="button"
                        icon={<SvgIcon shape="download" width={20} height={20} />}
                        onClick={onClickDownload}
                    >
                        다운로드
                    </DownloadButton>
                </CanvasButtonsDiv>
                <Canvas
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
                    setDownloadUrl={setDownloadUrl}
                />

                <LeftInsideDiv>
                    <Checkbox checked={visibleTime} {...bindVisibleTime} />
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
                </LeftInsideDiv>
                <LeftInsideDiv>
                    <LabelText label="이름(나이)" name="name" value={name} onChange={onChangeInput} maxLength={20} />
                    <Checkbox checked={visibleJob} {...bindVisibleJob} />
                    <LabelText label="직업" name="job" value={job} onChange={onChangeInput} maxLength={15} />
                </LeftInsideDiv>
                <LeftInsideDiv>
                    <Checkbox checked={speechIsQuestion} {...bindSpeechIsQuestion} />
                    <LabelText
                        label="대사1"
                        name="speechTop"
                        value={speechTop}
                        onChange={onChangeInput}
                        maxLength={26}
                    />
                </LeftInsideDiv>
                <LeftInsideDiv>
                    <LabelText
                        label="대사2"
                        name="speechBottom"
                        value={speechBottom}
                        onChange={onChangeInput}
                        maxLength={26}
                    />
                </LeftInsideDiv>
                <LeftInsideDiv>
                    <LabelText label="작품 명" name="title" value={title} onChange={onChangeInput} />
                </LeftInsideDiv>
            </CanvasForm>
            <ListDiv>
                <ListTitle>짤들</ListTitle>
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
    width: 100%;
`;
const CanvasForm = styled.form`
    display: flex;
    flex-direction: column;
    flex-basis: 50%;
    min-width: 50%;
    align-items: center;
`;

const ListTitle = styled.h2`
    display: flex;
    flex-basis: 100%;
    text-align: center;
    justify-content: center;
    height: 10%;
`;
const ListDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-basis: 50%;
    min-width: 50%;
    flex-flow: wrap;
    align-items: center;
    padding-right: 1em;
    box-sizing: border-box;
    align-items: flex-start;
    align-content: flex-start;
`;

const LeftInsideDiv = styled.div`
    display: flex;
    align-items: center;
    width: 80%;
`;

const DownloadButton = styled(Button)``;
const CanvasButtonsDiv = styled.div`
    display: flex;
    width: 80%;
    flex-direction: row-reverse;

    button {
        margin: 0.5em;
    }
`;
export default Main;
