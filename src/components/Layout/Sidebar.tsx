import React, { useContext, useEffect } from 'react';
import styled from '@emotion/styled';

import { Link, useHistory, useLocation } from 'react-router-dom';
import { css } from '@emotion/react';
import { AuthContext } from '~context/AuthContext';
import Button from '~components/Button/Button';
import SvgIcon from '~components/Icon/SvgIcon';
import { ModalActionContext } from '~context/ModalContext';
import { toast } from 'react-toastify';
import { SpinnerContext } from '~context/SpinnerContext';

import Login from '~components/Login/Login';
import { auth } from '~firebase/firebaseInstance';
import { signOut } from 'firebase/auth';

const Sidebar = () => {
    // URL의 path값을 받아올 수 있다.
    const pathName = useLocation().pathname;
    const {
        state: { authUser },
    } = useContext(AuthContext);
    const { closeModal, setModalProps } = useContext(ModalActionContext);
    const { setSpinnerVisible } = useContext(SpinnerContext);

    useEffect(() => {
        closeModal();
    }, [authUser]);
    const history = useHistory();
    const logOut = async () => {
        setSpinnerVisible(true);
        try {
            await signOut(auth);
            history.push('/');
            toast.info('로그아웃 되었습니다.');
        } catch (error) {
            toast.error('로그아웃 중 오류가 발생했습니다.');
        } finally {
            setSpinnerVisible(false);
        }
    };
    return (
        <SidebarContainer>
            <div
                css={css`
                    position: fixed;
                    height: 100%;
                `}
            >
                <MenuContainer>
                    <MenuDiv>
                        <HomeLink to="/">
                            <SvgIcon shape="home" />
                            <h3>인간극장 짤 생성기</h3>
                        </HomeLink>
                        <MenuItem active={pathName == '/' ? 1 : 0}>
                            <StyledLink active={pathName == '/' ? 1 : 0} to="/">
                                만들기
                            </StyledLink>
                        </MenuItem>
                        <MenuItem active={pathName == '/list' ? 1 : 0}>
                            <StyledLink active={pathName == '/list' ? 1 : 0} to="/list">
                                짤 자랑
                            </StyledLink>
                        </MenuItem>
                        {authUser && (
                            <MenuItem active={pathName == '/profile' ? 1 : 0}>
                                <StyledLink active={pathName == '/profile' ? 1 : 0} to="/profile">
                                    프로필
                                </StyledLink>
                            </MenuItem>
                        )}
                    </MenuDiv>
                    {authUser ? (
                        <ProfileDiv>
                            {authUser.photoURL ? (
                                <UserInfoDiv>
                                    <img src={authUser.photoURL} width="50px" height="50px" />
                                    <h4>{authUser.displayName}</h4>
                                </UserInfoDiv>
                            ) : (
                                <UserInfoDiv>
                                    <SvgIcon shape="profile" width={50} height={50} color="white" />
                                    <h4>{authUser.displayName}</h4>
                                </UserInfoDiv>
                            )}
                            <Button
                                css={css`
                                    padding: 0;
                                `}
                                icon={<SvgIcon shape="logout" width={20} height={20} />}
                                onClick={() => logOut()}
                                border="none"
                            />
                        </ProfileDiv>
                    ) : (
                        <ProfileDiv>
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
                        </ProfileDiv>
                    )}
                </MenuContainer>
            </div>
        </SidebarContainer>
    );
};

interface IMenu {
    active: number;
}

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;

    justify-content: space-between;
    height: 100%;
`;

const MenuDiv = styled.div`
    margin-top: 1em;
    margin-bottom: 1em;
    box-sizing: border-box;
    padding-right: 2.5em;
    overflow-y: auto;
`;
const SidebarContainer = styled.div`
    border-right: 1px solid ${props => props.theme.colors.gray};
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    align-items: flex-end;
`;

const MenuItem = styled.div<IMenu>`
    position: relative;
    margin: 3.2em 0;

    &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 0.2em;
        background: black;
        left: 0;
        bottom: 0;
        background-image: linear-gradient(to right, #5e42a6, #b74e91);

        opacity: ${props => !props.active && '0.2'};
    }
`;

const StyledLink = styled(Link)<IMenu>`
    line-height: 4em;
    text-decoration: none;
    letter-spacing: 0.2em;
    display: block;
    transition: all ease-out 300ms;

    color: ${props => (props.active ? props.theme.colors.white : props.theme.colors.gray)};

    &:hover {
        color: ${props => !props.active && props.theme.colors.white};
    }
`;

const ProfileDiv = styled.div`
    display: flex;
    img {
        border-radius: 50%;
    }
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-top: 1em;
    margin-bottom: 1em;
    justify-content: center;
`;

const UserInfoDiv = styled.div`
    display: flex;
    align-items: center;

    h4 {
        padding-left: 0.4em;
    }
`;

const HomeLink = styled(Link)`
    color: ${props => props.theme.colors.white};
    display: flex;
    align-items: center;
    h3 {
        padding-left: 0.5em;
    }
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active {
        text-decoration: none;
    }
`;
export default Sidebar;
