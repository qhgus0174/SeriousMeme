import { createPortal } from 'react-dom';
import BasicModal from './Theme/BasicModal';

interface IModalOption {
    visible: boolean;
    setParentState: (e: boolean) => void;
    width?: string;
    height?: string;
    headerTitle?: string;
}

export interface IModalPortal {
    modalType: 'basic';
    options: IModalOption;
    children: React.ReactNode;
}

export interface IModal {
    options: IModalOption;
    children: React.ReactNode;
}

export interface IModalStyle {
    options: {
        visible: boolean;
        width?: string;
        height?: string;
    };
}

const ModalPortal = ({ modalType, options, children }: IModalPortal) => {
    const renderModal = () => {
        switch (modalType) {
            case 'basic':
                return <BasicModal options={options}>{children}</BasicModal>;
            default:
                return <></>;
        }
    };

    return createPortal(renderModal(), document.getElementById('modal-root') as HTMLElement);
};

export default ModalPortal;
