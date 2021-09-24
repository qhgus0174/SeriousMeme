import React, { useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalActionContext, ModalStateContext } from '~context/ModalContext';
import BasicModal from '~components/Modal/Theme/BasicModal';
import Dialog from '~components/Modal/Theme/Dialog';
import { IModalOption, IModalProps } from '~hooks/useModal';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { media } from '~styles/device';

export interface IModal {
    children: React.ReactNode;
    options?: IModalOption;
}

const ModalPortal = () => {
    const { isOpen, content, type, options } = useContext(ModalStateContext);
    const { closeModal } = useContext(ModalActionContext);

    const renderModal = () => {
        switch (type) {
            case 'basic':
                return <BasicModal options={options}>{content}</BasicModal>;
            case 'dialog':
                return <Dialog options={options}>{content}</Dialog>;
            default:
                return <></>;
        }
    };

    return createPortal(
        isOpen && (
            <ModalDimmer
                tabIndex={-1}
                onClick={() => {
                    closeModal();
                }}
            >
                <ModalInner
                    tabIndex={0}
                    width={options?.width}
                    height={options?.height}
                    type={type}
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    {renderModal()}
                </ModalInner>
            </ModalDimmer>
        ),
        document.getElementById('modal-root') as HTMLElement,
    );
};

const ModalDimmer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    box-sizing: border-box;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

const ModalInner = styled.div<Pick<IModalOption, 'width' | 'height'> & Pick<IModalProps, 'type'>>`
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden; //각을 없앴을 때 내부 영역이 튀어나오는걸 방지
    outline: none;
    box-shadow: 5px 10px 10px 1px rgba(0, 0, 0, 0.3);
    width: 100%;
    background-color: ${props => props.theme.colors.mainBackground};
    ${props => {
        switch (props.type) {
            case 'basic':
                return css`
                    max-width: ${props.width ? props.width : '60'}vw;
                    height: ${props.height ? props.height : '60'}vh;

                    //1024px 보다 작으면
                    ${media.desktop} {
                        max-width: ${Number(props.width ? props.width : '60') * 1.4}vw;
                    }

                    //768px 보다 작으면
                    ${media.tablet} {
                        max-width: ${Number(props.width ? props.width : '60') * 1.8}vw;
                    }

                    //480px 보다 작으면
                    ${media.phone} {
                        max-width: 80vw;
                    }
                `;
            case 'dialog':
                return css`
                    max-width: ${props.width ? props.width : '30'}vw;
                    height: ${props.height ? props.height : '30'}vh;
                `;
        }
    }}
`;

export default ModalPortal;
