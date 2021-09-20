import React from 'react';
import styled from '@emotion/styled';
import { media } from '~styles/device';
import { IModalOption } from '~hooks/useModal';
import { IModal } from '~components/Modal/ModalPortal';

const BasicModal = ({ children, options }: IModal) => {
    return (
        <>
            {options?.headerTitle && <ModalHeader>{options.headerTitle}</ModalHeader>}
            <ModalBody>
                <ModalContent>{children}</ModalContent>
            </ModalBody>
        </>
    );
};

const ModalHeader = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
    height: 20%;
    font-size: 1.6em;
    font-weight: 500;
    box-sizing: border-box;
`;

//body영역은 내용에 스크롤이 발생 할 수 있기 때문에 좀 더 세분화
const ModalBody = styled.div`
    box-sizing: border-box;
`;

const ModalContent = styled.div`
    padding: 30px;
    box-sizing: border-box;
`;

export default BasicModal;
