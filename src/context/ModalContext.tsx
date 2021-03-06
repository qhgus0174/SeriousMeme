import React, { createContext } from 'react';
import ModalPortal from '~components/Modal/ModalPortal';
import { IModalProps, useModal } from '~hooks/useModal';

interface IModalAction {
    openModal: () => void;
    closeModal: () => void;
    setModalProps: (e: IModalProps) => void;
}

export const ModalStateContext = createContext<IModalProps>({
    isOpen: false,
    type: 'basic',
    content: <></>,
});

export const ModalActionContext = createContext<IModalAction>({
    openModal: () => {},
    closeModal: () => {},
    setModalProps: (e: IModalProps) => {},
});

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const { isOpen, type, content, options, openModal, closeModal, setModalProps } = useModal();

    return (
        <ModalActionContext.Provider value={{ openModal, closeModal, setModalProps }}>
            <ModalStateContext.Provider value={{ isOpen, type, content, options }}>
                <ModalPortal />
                {children}
            </ModalStateContext.Provider>
        </ModalActionContext.Provider>
    );
};

export default ModalProvider;
