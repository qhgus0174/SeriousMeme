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
        <DialogContainer>
            <DialogBody>{children}</DialogBody>
            <DialogBottom>
                <Button
                    onClick={async () => {
                        setSpinnerVisible(true);
                        options?.confirmFn && (await options.confirmFn());
                        setSpinnerVisible(false);
                        closeModal();
                    }}
                    color="main"
                >
                    확인
                </Button>
                <Button onClick={closeModal}>취소</Button>
            </DialogBottom>
        </DialogContainer>
    );
};

const DialogContainer = styled.div`
    padding: 1.5em 0.5em 0 0.5em;
    display: flex;
    flex-direction: column;
`;
const DialogBody = styled.div`
    padding: 1.5em 1.5em 2.5em 1.5em;
    box-shadow: 0 4px 6px -6px rgb(0 0 0 / 0.3);
`;
const DialogBottom = styled.div`
    display: flex;
    margin-left: auto;
    padding-top: 1em;
    button {
        margin-right: 0.5em;
        box-sizing: border-box;
    }
`;

export default Dialog;
