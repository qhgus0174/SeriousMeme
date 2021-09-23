import React, { useContext } from 'react';
import styled from '@emotion/styled';
import Button from '~components/Button/Button';
import { IModal } from '~components/Modal/ModalPortal';
import { ModalActionContext } from '~context/ModalContext';
import { SpinnerContext } from '~context/SpinnerContext';

const Dialog = ({ children, options }: IModal) => {
    const { closeModal } = useContext(ModalActionContext);
    const { setSpinnerVisible } = useContext(SpinnerContext);

    return (
        <>
            <DialogHeader>{options?.headerTitle ? options.headerTitle : '경고'}</DialogHeader>
            <DialogBody>{children}</DialogBody>
            <DialogBottom>
                <Button
                    onClick={async () => {
                        setSpinnerVisible(true);
                        options?.confirmFn && (await options.confirmFn());
                        setSpinnerVisible(false);
                        closeModal();
                    }}
                >
                    확인
                </Button>
                <Button onClick={closeModal}>취소</Button>
            </DialogBottom>
        </>
    );
};

const DialogHeader = styled.span``;
const DialogBody = styled.div``;
const DialogBottom = styled.div`
    display: flex;
`;

export default Dialog;
