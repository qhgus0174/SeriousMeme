import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { media } from '~styles/device';
import { ModalActionContext } from 'context/ModalContext';
import { IModalOption } from 'hooks/useModal';
import { IModal } from '../ModalPortal';

const BasicModal = ({ children, options }: IModal) => {
    const { closeModal } = useContext(ModalActionContext);
    return (
        <>
            <ModalWrapper
                className="modalWrapper"
                tabIndex={-1}
                onClick={() => {
                    closeModal();
                }}
            >
                <ModalInner
                    className="modalInner"
                    tabIndex={0}
                    width={options?.width}
                    height={options?.height}
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                    }}
                >
                    {options?.headerTitle && <ModalHeader>{options.headerTitle}</ModalHeader>}
                    <ModalBody className="modalBody">
                        <ModalContent className="modalContent">{children}</ModalContent>
                    </ModalBody>
                </ModalInner>
            </ModalWrapper>
        </>
    );
};

const ModalWrapper = styled.div`
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

//반응형이기 때문에 가로값(width)은 100%를 잡고, max-width로 최대값을 잡습니다.
const ModalInner = styled.div<Pick<IModalOption, 'width' | 'height'>>`
    // 여기 media쿼리 밖이 기본 css 세팅임
    box-sizing: border-box;
    background-color: white;
    border-radius: 4px;
    overflow: hidden; //각을 없앴을 때 내부 영역이 튀어나오는걸 방지
    width: 100%;

    //부모 기준 X, 브라우저 기준이라 v* 사용
    max-width: ${props => (props.width ? props.width : '60')}vw;
    height: ${props => (props.height ? props.height : '60')}vh;

    outline: none;
    box-shadow: 5px 10px 10px 1px rgba(0, 0, 0, 0.3);

    //1024px 보다 작으면
    ${media.desktop} {
        max-width: ${props => Number(props.width ? props.width : '60') * 1.4}vw;
    }

    //768px 보다 작으면
    ${media.tablet} {
        max-width: ${props => Number(props.width ? props.width : '60') * 1.8}vw;
    }

    //480px 보다 작으면
    ${media.phone} {
        max-width: 80vw;
    }
`;

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
