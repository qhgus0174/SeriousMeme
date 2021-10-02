import React, { useContext, useState } from 'react';
import { AuthContext } from '~context/AuthContext';
import { SpinnerContext } from '~context/SpinnerContext';
import Button from '~components/Button/Button';
import LabelText from '~components/Input/LabelText';
import Canvas from '~components/Canvas/canvas';

import { getDownloadURL } from '@firebase/storage';
import { addDoc } from '~firebase/board/board';
import { uploadByAttachmentUrlBoard } from '~firebase/storage/storage';

import { useCheckbox } from '~hooks/useCheckbox';

import { nowDateTime, nowDateToMillis, nowDay, nowDayOfWeek } from '~utils/luxon';
import styled from '@emotion/styled';
import Checkbox from '~components/Input/Checkbox';
import SvgIcon from '~components/Icon/SvgIcon';
import { toast } from 'react-toastify';
import { media } from '~styles/device';

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
        title: '샘플입니다!',
        name: '박스(24)',
        job: '짤 만드는 공간',
        speechTop: ' 이렇게 만들 수 있어요! ',
        speechBottom: ' 여기를 눌러 사진을 선택해주세요📷 ',
    };

    const resetState: IFormState = {
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

    const [isReset, setIsReset] = useState<boolean>(false);
    const [newAttachment, setNewAttachment] = useState<string>('');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [childCanvas, setChildCanvas] = useState<HTMLCanvasElement | null>(null);
    const [childCanvasCtx, setChildCanvasCtx] = useState<CanvasRenderingContext2D | null | undefined>(null);

    const isCanvasBlank = () => {
        if (!childCanvas || !childCanvasCtx) return;

        const pixelBuffer = new Uint32Array(
            childCanvasCtx.getImageData(0, 0, childCanvas.width, childCanvas.height).data.buffer,
        );

        return !pixelBuffer.some(color => color !== 0);
    };

    const addPost = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isCanvasBlank()) {
            toast.error('짤을 먼저 만들어주세요.');
            return;
        }

        setSpinnerVisible(true);
        try {
            let attatchmentUrl: string ="";
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
            toast.success('짤을 자랑했습니다!');
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
        setState({ ...resetState });
    };

    const onClickDownload = () => {
        if (isCanvasBlank()) {
            toast.error('짤을 먼저 만들어주세요.');
            return;
        }
        toast.info('짤을 다운로드 합니다.');
        setSpinnerVisible(true);
        var a = document.createElement('a');
        a.download = `${nowDateToMillis}.png`;
        a.href = downloadUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setSpinnerVisible(false);
    };

    return (
        <MainContainer>
            <CanvasForm onSubmit={addPost}>
                <CanvasButtonsDiv>
                    <ResetButtonDiv>
                        <Button
                            type="button"
                            icon={<SvgIcon shape="reset" width={20} height={20} />}
                            onClick={() => setIsReset(true)}
                        />
                    </ResetButtonDiv>
                    <DownButtonDiv>
                        <Button
                            type="button"
                            icon={<SvgIcon shape="download" width={20} height={20} />}
                            onClick={onClickDownload}
                        >
                            다운로드
                        </Button>
                        <Button color="main" type="submit">
                            자랑하기
                        </Button>
                    </DownButtonDiv>
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
                    setParentCanvas={setChildCanvas}
                    setParentCanvasCtx={setChildCanvasCtx}
                    setParentStateClear={clearState}
                    isReset={isReset}
                    setIsReset={() => setIsReset(false)}
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
                    <LabelText label="요일" name="dayOfWeek" value={dayOfWeek} onChange={onChangeInput} maxLength={3} />
                    <LabelText label="시간" name="time" value={time} onChange={onChangeInput} maxLength={5} />
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
        </MainContainer>
    );
};

const MainContainer = styled.div`
    flex-basis: 75%;
    margin-top: 2em;
`;
const CanvasForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const LeftInsideDiv = styled.div`
    display: flex;
    align-items: center;
    width: 80%;
`;

const CanvasButtonsDiv = styled.div`
    display: flex;
    width: 80%;

    button {
        margin: 0.5em;
    }
`;
const ResetButtonDiv = styled.div`
    margin-right: auto;
`;
const DownButtonDiv = styled.div`
    display: flex;
`;
export default Main;
