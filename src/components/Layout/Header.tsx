import React, { useContext, useEffect } from 'react';
import Button from '~components/Button/Button';
import styled from '@emotion/styled';
import Login from '~components/Login/Login';
import SvgIcon from '~components/Icon/SvgIcon';
import { AuthContext } from 'context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from 'firebase/firebaseInstance';
import Spinner from '~components/Spinner/Spinner';
import { toast } from 'react-toastify';
import { ModalActionContext } from 'context/ModalContext';

const Header = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);

    const { openModal, closeModal, setModalProps } = useContext(ModalActionContext);

    const logOut = async () => {
        <Spinner visible={true} />;
        await signOut(auth)
            .then(() => {
                toast('로그아웃 되었습니다.');
            })
            .catch(error => {
                toast.error('로그아웃 중 오류가 발생했습니다.');
            });
    };

    useEffect(() => {
        closeModal();
    }, [authUser]);

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
                            authUser
                                ? logOut()
                                : setModalProps({
                                      isOpen: true,
                                      type: 'basic',
                                      content: <Login />,
                                      options: { width: '30', height: '80', headerTitle: 'LOGIN' },
                                  });
                        }}
                    >
                        {authUser ? '로그아웃' : '로그인'}
                    </Button>
                </RightDiv>
            </HeaderDiv>
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
