import React, { useState } from 'react';
import Button from '~components/Button/Button';
import styled from '@emotion/styled';
import ModalPortal from '~components/Modal/ModalPortal';
import Login from '~components/Login/Login';
import SvgIcon from '~components/Icon/SvgIcon';
//import { useTheme } from '@emotion/react';

const Header = () => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    //const theme = useTheme();

    return (
        <>
            <HeaderDiv>
                <LeftDiv>
                    <SvgIcon shape="star-fill" />
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

const HeaderDiv = styled.div(props => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: props.theme.colors.mainBackground,
    color: 'black',
    boxSizing: 'border-box',
    padding: '1rem',
    alignItems: 'center',
}));

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

export default Header;
