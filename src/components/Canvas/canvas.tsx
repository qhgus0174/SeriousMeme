import React, { CanvasHTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { media } from '~styles/device';
import { css } from '@emotion/react';
import blackImage from '~assets/image/black.png';
import WebFont from 'webfontloader';

interface ICanvas extends CanvasHTMLAttributes<HTMLCanvasElement> {
    text: {
        clock: {
            visible: boolean;
            day: string;
            dayOfWeek: string;
            time: string;
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
        };
    };
    setDownloadUrl: (e: string) => void;
    setNewAttachment: (e: string) => void;
    setParentCanvas: (e: HTMLCanvasElement | null) => void;
    setParentCanvasCtx: (e: CanvasRenderingContext2D | null | undefined) => void;
    setParentStateClear: () => void;
    isReset: boolean;
    setIsReset: (e: boolean) => void;
}

const Canvas = ({
    text,
    setNewAttachment,
    setDownloadUrl,
    setParentCanvas,
    setParentCanvasCtx,
    setParentStateClear,
    isReset = false,
    setIsReset,
}: ICanvas) => {
    const maxWidth = 600;
    const maxHeight = 400;
    const font = {
        day: 'bold 20px Gothic A1',
        clock: 'bold 23px Gothic A1',
        name: '25px Nanum Myeongjo',
        job: '21px Nanum Myeongjo',
        script: '22px Nanum Myeongjo',
    };

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
    const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null | undefined>();

    const [attachment, setAttachment] = useState<string>(blackImage);

    const imageInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setCanvas(canvasRef.current);
        setCanvasCtx(canvasRef.current?.getContext('2d'));
        setParentCanvas(canvasRef.current);
        setParentCanvasCtx(canvasRef.current?.getContext('2d'));

        WebFont.load({
            google: {
                families: ['Nanum Myeongjo', 'Gothic A1'],
            },
        });
    }, [canvas, canvasCtx]);

    useEffect(() => {
        initCanvas();
    }, [text]);

    useEffect(() => {
        if (!isReset) return;
        setIsReset(false);
        resetCanvas();
        setParentStateClear();
        return;
    }, [isReset]);

    const initCanvas = () => {
        if (!canvas || !canvasCtx) return;
        const bgImage = new Image();
        bgImage.src = attachment;

        bgImage.onload = function () {
            drawImage(bgImage);
            drawText();
            makeImageUrl();
        };
    };

    const resetCanvas = () => {
        if (!canvas || !canvasCtx) return;
        setAttachment('');
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const clearCanvas = () => {
        if (!canvas || !canvasCtx) return;
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    };

    const drawImage = (bgImage: HTMLImageElement) => {
        if (!canvas || !canvasCtx || isReset) return;

        clearCanvas();
        canvasCtx.drawImage(bgImage, 0, 0, 600, 400);
    };

    const drawText = () => {
        if (!canvas || !canvasCtx || isReset) return;

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
            styleText(day, 47, 47, font.day);
            styleText(`(${dayOfWeek})`, 79, 47, font.day);

            styleText(time, 65, 74, font.clock);
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

        styleText(name, calcSpace(canvasCenterAround, name, -1, 15.5), 280, font.name);

        if (jobVisible) {
            jobName && styleText('/', canvasCenterAround, 280, font.name);

            styleText(jobName, calcSpace(canvasCenterAround, jobName, 1, 12.5), 280, font.job);
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
        topText && styleText(`"${topText}"`, canvas.width / 2, 320, font.script, isQuestion);
        bottomText && styleText(`"${bottomText}"`, canvas.width / 2, 355, font.script);
    };

    const styleText = (text: string, x: number, y: number, font: string, color?: boolean) => {
        if (!canvas || !canvasCtx) return;

        canvasCtx.font = font;

        canvasCtx.lineWidth = 5;
        canvasCtx.strokeStyle = '#000000';
        canvasCtx.lineJoin = 'round';
        canvasCtx.strokeText(text, x, y);

        canvasCtx.fillStyle = color ? '#e9e910' : '#FFFFFF';
        canvasCtx.fillText(text, x, y);
    };

    const calcSpace = (bench: number, text: string, operator: 1 | -1, spaceWith: number) => {
        const onlyTextLength = text.replace(/[~!@#$%^&*()_+|<>?:{}."' 0-9a-zA-Z]/gi, '').length;

        const containNumberArr = text.match(/[0-9]/gi);
        const numberLength = containNumberArr ? containNumberArr.length / 1.7 : 0;

        const containEngArr = text.match(/[a-zA-Z]/gi);
        const engLength = containEngArr ? containEngArr.length / 1.6 : 0;

        const containSpcArr = text.match(/[~!@#$%^&*()_+|<>?:{}."']/gi);
        const spcLength = containSpcArr ? containSpcArr.length / 2.5 : 0;

        const textLength = bench + (onlyTextLength + numberLength + engLength + spcLength) * operator * spaceWith;

        return textLength;
    };

    const isCanvasBlank = () => {
        if (!canvas || !canvasCtx) return;

        const pixelBuffer = new Uint32Array(canvasCtx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);

        return !pixelBuffer.some(color => color !== 0);
    };

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;

        if (!files) return;
        const file = files[0];
        const reader = new FileReader();

        if (!file) return;
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            const renderResult = reader.result;
            if (renderResult instanceof ArrayBuffer || renderResult == null) return;
            setAttachment(renderResult);
            setParentStateClear();
        };
    };

    return (
        <CanvasContainer>
            <CustomCanvas
                onClick={() => imageInputRef.current?.click()}
                width={maxWidth}
                height={maxHeight}
                ref={canvasRef}
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
        </CanvasContainer>
    );
};

const CanvasContainer = styled.div`
    width: 80%;
    text-align: center;
`;

const CustomCanvas = styled.canvas`
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
    border: thin solid ${props => props.theme.colors.white};
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

export default Canvas;
