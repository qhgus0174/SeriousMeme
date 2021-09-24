import React, { useContext, useEffect } from 'react';
import Button from '~components/Button/Button';
import SvgIcon from '~components/Icon/SvgIcon';
import Login from '~components/Login/Login';
import styled from '@emotion/styled';
import { AuthContext } from '~context/AuthContext';
import { auth } from '~firebase/firebaseInstance';
import { ModalActionContext } from '~context/ModalContext';

import ProfileImg from '~assets/svg/defaultProfile.svg';

import { signOut } from 'firebase/auth';

import { toast } from 'react-toastify';
import { SpinnerContext } from '~context/SpinnerContext';
import { Link, useHistory } from 'react-router-dom';

const Header = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);

    const history = useHistory();
    const { closeModal, setModalProps } = useContext(ModalActionContext);
    const { setSpinnerVisible } = useContext(SpinnerContext);

    const logOut = async () => {
        setSpinnerVisible(true);
        try {
            await signOut(auth);
            history.push('/');
            toast('로그아웃 되었습니다.');
        } catch (error) {
            toast.error('로그아웃 중 오류가 발생했습니다.');
        } finally {
            setSpinnerVisible(false);
        }
    };

    useEffect(() => {
        closeModal();
    }, [authUser]);

    return (
        <HeaderDiv>
            <PaddingDiv></PaddingDiv>
            <PaddingDiv>
                <StyledLink to="/">
                    <SvgIcon shape="home" />
                    <h3>인간극장 짤 생성기</h3>
                </StyledLink>
            </PaddingDiv>
            {authUser ? (
                <ProfileParentUl>
                    <ProfileParentLi>
                        <PaddingDiv>
                            {authUser.photoURL ? (
                                authUser.photoURL ? (
                                    <img src={authUser.photoURL} width="50px" height="50px" />
                                ) : (
                                    <SvgIcon shape="profile" width={50} height={50} color="white" />
                                )
                            ) : (
                                <SvgIcon shape="profile" width={50} height={50} color="white" />
                            )}
                        </PaddingDiv>
                        <ProfileChildUl>
                            <StyledLink to="/profile">
                                <ProfileChildLi>PROFILE</ProfileChildLi>
                            </StyledLink>
                            <ProfileChildLi onClick={() => logOut()}>LOGOUT</ProfileChildLi>
                        </ProfileChildUl>
                    </ProfileParentLi>
                </ProfileParentUl>
            ) : (
                <PaddingDiv>
                    <Button
                        onClick={() => {
                            setModalProps({
                                isOpen: true,
                                type: 'basic',
                                content: <Login />,
                                options: { width: '30', height: '80', headerTitle: 'LOGIN' },
                            });
                        }}
                    >
                        LOGIN
                    </Button>
                </PaddingDiv>
            )}
        </HeaderDiv>
    );
};

const PaddingDiv = styled.div`
    padding-left: 1em;
    padding-right: 1em;
    img {
        border-radius: 50%;
    }
`;

const HeaderDiv = styled.div`
    padding: 1em;
    margin-bottom: 2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 3px 9px -1px rgb(0 0 0 / 0.3);
`;

const ProfileChildUl = styled.ul`
    display: none;
    margin-top: 0;
`;

const ProfileChildLi = styled.li`
    cursor: pointer;
    padding: 1em;

    &:hover {
        background: rgb(145, 109, 213, 0.6);
        box-shadow: 0px 3px 9px -1px rgb(0 0 0 / 80%);
        //color: ${props => props.theme.colors.main};
        //opacity: 0.9;
    }
`;

const ProfileParentUl = styled.ul``;

const ProfileParentLi = styled.li`
    position: relative;

    &:hover ${ProfileChildUl} {
        display: block;
        position: absolute;
        margin-left: -0.4em;
    }
`;

const StyledLink = styled(Link)`
    color: ${props => props.theme.colors.white};
    display: flex;
    align-items: center;
    h3 {
        padding-left: 1em;
    }
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
    }
`;

export default Header;
