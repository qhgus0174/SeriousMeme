import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { ModalStateContext } from '~context/ModalContext';
import BasicModal from '~components/Modal/Theme/BasicModal';
import { IModalOption } from '~hooks/useModal';

export interface IModal {
    children: React.ReactNode;
    options?: IModalOption;
}

const ModalPortal = () => {
    const { isOpen, content, type, options } = useContext(ModalStateContext);
    const renderModal = () => {
        switch (type) {
            case 'basic':
                return <BasicModal options={options}>{content}</BasicModal>;
            default:
                return <>aaa</>;
        }
    };

    return createPortal(isOpen && renderModal(), document.getElementById('modal-root') as HTMLElement);
};

export default ModalPortal;
