import React, { ReactElement, useState } from 'react';
import Button from '~components/Button/Button';
import styled from '@emotion/styled';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ModalPortal from '~components/Modal/ModalPortal';
import Login from '~components/Login/Login';

const HeaderDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #2979ff;
    color: white;
    box-sizing: border-box;
    padding: 1em;
    align-items: center;
`;

const LeftDiv = styled.div`
    display: flex;
    flex-basis: 20%;
`;

const CenterDiv = styled.div`
    display: flex;
    flex-basis: 60%;
    justify-content: center;
`;

const RightDiv = styled.div`
    display: flex;
    flex-basis: 20%;
    justify-content: right;
`;

const Header = () => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    return (
        <>
            <HeaderDiv>
                <LeftDiv>
                    <StarBorderIcon />
                </LeftDiv>
                <CenterDiv>인간극장 짤 생성</CenterDiv>
                <RightDiv>
                    <Button
                        onClick={() => {
                            setIsOpenModal(true);
                        }}
                    >
                        로그인
                    </Button>
                </RightDiv>
            </HeaderDiv>
            <ModalPortal
                modalType="basic"
                options={{
                    width: '30',
                    height: '80',
                    visible: isOpenModal,
                    setParentState: setIsOpenModal,
                    headerTitle: 'LOGIN',
                }}
            >
                <Login />
            </ModalPortal>
        </>
    );
};

export default Header;
