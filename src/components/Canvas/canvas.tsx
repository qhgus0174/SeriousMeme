import React, { CanvasHTMLAttributes, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { nowDateToMillis } from '~utils/luxon';
import { media } from '~styles/device';

interface ICanvas extends CanvasHTMLAttributes<HTMLCanvasElement> {
    imageUrl: string;
    text: {
        clock: {
            visible: boolean;
            day: string;
            dayOfWeek: string;
            time: string;
            font?: string;
            fontColor?: string;
            fontSize?: string;
        };
        script: {
            name: string;
            job: {
                visible: boolean;
                jobName: string;
            };
            speech: {
                top: {
                    isQuestion: boolean;
                    text: string;
                };
                bottom: string;
            };
            font?: string;
            fontColor?: string;
            fontSize?: string;
        };
    };
    setNewAttachment: (e: string) => void;
}

const Canvas = ({ imageUrl, text, setNewAttachment }: ICanvas) => {
    const maxWidth = 600;
    const maxHeight = 400;

    const [downloadUrl, setDownloadUrl] = useState<string>('');

    const [backgroundImage, setBackgroundImage] = useState<string>('');

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
    const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null | undefined>();

    useEffect(() => {
        setBackgroundImage(imageUrl);
        setCanvas(canvasRef.current);
        setCanvasCtx(canvasRef.current?.getContext('2d'));

        initCanvas();
    });

    const initCanvas = () => {
        if (!canvas || !canvasCtx) return;

        if (!backgroundImage) clearCanvas();

        const bgImage = new Image();
        bgImage.src = backgroundImage;

        bgImage.onload = function () {
            drawImage(bgImage);
            drawText();
            makeImageUrl();
        };
    };

    const clearCanvas = () => {
        if (!canvas || !canvasCtx) return;
        canvasCtx.clearRect(0, 0, canvas.width, canvas.width);
        return;
    };

    const drawImage = (bgImage: HTMLImageElement) => {
        if (!canvas || !canvasCtx) return;

        const width = bgImage.width > bgImage.height ? maxWidth : (bgImage.width * maxWidth) / bgImage.height;
        const height = bgImage.width > bgImage.height ? (bgImage.height * maxWidth) / bgImage.width : maxHeight;
        canvasCtx.drawImage(bgImage, 0, 0, width, height);
    };

    const drawText = () => {
        if (!canvas || !canvasCtx) return;

        canvasCtx.textAlign = 'center';
        canvasCtx.textBaseline = 'middle';

        drawClockText();
        drawScriptText();
        drawSpeechText();
    };

    const makeImageUrl = () => {
        if (!canvas || isCanvasBlank()) return;

        const canvasToDataUrl = canvas.toDataURL('image/jpg');

        setDownloadUrl(canvasToDataUrl);
        setNewAttachment(canvasToDataUrl);
    };

    const drawClockText = () => {
        if (!canvas || !canvasCtx) return;

        const {
            clock: { visible, day, dayOfWeek, time },
        } = text;

        if (visible) {
            canvasCtx.font = '20px Spoqa Han Sans Neo';
            styleText(day, 42, 45);
            styleText(`(${dayOfWeek})`, 72, 45);

            canvasCtx.font = '22px Spoqa Han Sans Neo';
            styleText(time, 57, 72);
        }
    };

    const drawScriptText = () => {
        if (!canvas || !canvasCtx) return;

        const {
            script: {
                name,
                job: { visible: jobVisible, jobName },
            },
        } = text;

        const canvasCenterAround = canvas.width / 2 + 10;

        canvasCtx.font = '25px NanumMyeongjo';
        styleText(name, calcSpace(canvasCenterAround, name, -1, 15.5), 280);

        if (jobVisible) {
            jobName && styleText('/', canvasCenterAround, 280);

            canvasCtx.font = '21px NanumMyeongjo';
            styleText(jobName, calcSpace(canvasCenterAround, jobName, 1, 13.5), 280);
        }
    };

    const drawSpeechText = () => {
        if (!canvas || !canvasCtx) return;
        const {
            script: {
                speech: {
                    top: { isQuestion, text: topText },
                    bottom: bottomText,
                },
            },
        } = text;
        canvasCtx.font = '22px NanumMyeongjo';
        styleText(topText, canvas.width / 2, 320, isQuestion);
        styleText(bottomText, canvas.width / 2, 355);
    };

    const styleText = (text: string, x: number, y: number, color?: boolean) => {
        if (!canvas || !canvasCtx) return;

        canvasCtx.lineWidth = 5;
        canvasCtx.strokeStyle = '#000000';
        canvasCtx.lineJoin = 'round';
        canvasCtx.strokeText(text, x, y);

        canvasCtx.fillStyle = color ? '#e9e910' : '#FFFFFF';
        canvasCtx.fillText(text, x, y);
    };

    const calcSpace = (bench: number, text: string, operator: 1 | -1, spaceWith: number) => {
        const onlyTextLength = text.replace(/[~!@#$%^&*()_+|<>?:{}. 0-9]/gi, '').length;

        const containNumberArr = text.match(/[0-9]/gi);
        const numberLength = containNumberArr ? containNumberArr.length / 1.7 : 0;
        const textLength = bench + (onlyTextLength + numberLength) * operator * spaceWith;

        return textLength;
    };

    const isCanvasBlank = () => {
        if (!canvas || !canvasCtx) return;

        const pixelBuffer = new Uint32Array(canvasCtx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);

        return !pixelBuffer.some(color => color !== 0);
    };

    const onClickDownload = () => {
        var a = document.createElement('a');
        a.download = `${nowDateToMillis}.png`;
        a.href = downloadUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <>
            <CustomCanvas width={maxWidth} height={maxHeight} ref={canvasRef} />
            <a onClick={onClickDownload}>바로 다운로드</a>
        </>
    );
};

export default Canvas;

const CustomCanvas = styled.canvas`
    width: 100%;
    ${props => `
                max-width: ${props.width ? props.width : '30'}px;
                height: ${props.height ? props.height : '40'}px;

                //1024px 보다 작으면
                ${media.desktop} {
                    max-width: ${Number(props.width ? props.width : '60') * 0.9}px;
                }

                //768px 보다 작으면
                ${media.tablet} {
                    max-width: ${Number(props.width ? props.width : '60') * 0.8}px;
                }
                `}
`;
