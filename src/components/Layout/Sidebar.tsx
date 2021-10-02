import React, { useContext, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { AuthContext } from '~context/AuthContext';
import { ModalActionContext } from '~context/ModalContext';
import { SpinnerContext } from '~context/SpinnerContext';
import Button from '~components/Button/Button';
import SvgIcon from '~components/Icon/SvgIcon';
import Login from '~components/Login/Login';
import { media } from '~styles/device';
import { auth } from '~firebase/firebaseInstance';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

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
        <>
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
                                    <SvgIcon color="white" shape="draw" width={28} height={28} />
                                    <span>만들기</span>
                                </StyledLink>
                            </MenuItem>
                            <MenuItem active={pathName == '/list' ? 1 : 0}>
                                <StyledLink active={pathName == '/list' ? 1 : 0} to="/list">
                                    <SvgIcon color="white" shape="images" width={28} height={28} />
                                    <span>짤 자랑</span>
                                </StyledLink>
                            </MenuItem>
                            {authUser && (
                                <MenuItem active={pathName == '/profile' ? 1 : 0}>
                                    <StyledLink active={pathName == '/profile' ? 1 : 0} to="/profile">
                                        <SvgIcon color="white" shape="myprofile" width={28} height={28} />
                                        <span>프로필</span>
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
                                <LogoutDiv>
                                    <Button
                                        icon={<SvgIcon shape="logout" width={20} height={20} />}
                                        onClick={() => logOut()}
                                        border="none"
                                    />
                                </LogoutDiv>
                            </ProfileDiv>
                        ) : (
                            <NologinDiv>
                                <Button
                                    icon={<SvgIcon shape="login" color="white" width={28} height={28} />}
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
                            </NologinDiv>
                        )}
                    </MenuContainer>
                </div>
            </SidebarContainer>
            <SidebarFooter>
                <StyledLink active={pathName == '/' ? 1 : 0} to="/">
                    <SvgIcon color="white" shape="draw" width={28} height={28} />{' '}
                </StyledLink>
                <StyledLink active={pathName == '/list' ? 1 : 0} to="/list">
                    <SvgIcon color="white" shape="images" width={28} height={28} />
                </StyledLink>
                <FooterDiv active={1}>
                    {authUser ? (
                        <StyledLink active={pathName == '/profile' ? 1 : 0} to="/profile">
                            {authUser.photoURL ? (
                                <img src={authUser.photoURL} width="50px" height="50px" />
                            ) : (
                                <SvgIcon color="white" shape="myprofile" width={28} height={28} />
                            )}
                        </StyledLink>
                    ) : (
                        <div
                            css={css`
                                display: flex;
                            `}
                            onClick={() => {
                                setModalProps({
                                    isOpen: true,
                                    type: 'basic',
                                    content: <Login />,
                                    options: { width: '30', height: '80', headerTitle: 'LOGIN' },
                                });
                            }}
                        >
                            <SvgIcon shape="login" color="white" width={28} height={28} />
                        </div>
                    )}
                </FooterDiv>
            </SidebarFooter>
        </>
    );
};

interface IMenu {
    active: number;
}

const SidebarContainer = styled.div`
    border-right: 1px solid ${props => props.theme.colors.gray};
    display: flex;
    flex-direction: column;
    flex-basis: 25%;
    align-items: flex-end;

    ${media.tablet} {
        flex-basis: 15%;
    }

    ${media.phone} {
        flex-basis: 0%;
    }
`;

const SidebarFooter = styled.div`
    display: none;
    ${media.phone} {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        width: 100%;
        background: ${props => props.theme.colors.main};
        align-items: center;
        justify-content: space-around;
    }
`;

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
    padding-right: 1.2em;
    padding-left: 1.2em;
    overflow-y: auto;
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

    ${media.tablet} {
        margin: 2em 0;
    }
`;

const StyledLink = styled(Link)<IMenu>`
    line-height: 4em;
    text-decoration: none;
    letter-spacing: 0.2em;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    transition: all ease-out 300ms;

    &:hover {
        color: ${props => !props.active && props.theme.colors.white};
    }

    & span {
        color: ${props => (props.active ? props.theme.colors.white : props.theme.colors.gray)};
    }

    & svg {
        opacity: ${props => !props.active && '0.2'};
        height: 4em;
    }

    ${media.tablet} {
        & span {
            display: none;
        }
    }
`;

const FooterDiv = styled.div<IMenu>`
    line-height: 4em;
    text-decoration: none;
    letter-spacing: 0.2em;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    transition: all ease-out 300ms;

    &:hover {
        color: ${props => !props.active && props.theme.colors.white};
    }

    & span {
        color: ${props => (props.active ? props.theme.colors.white : props.theme.colors.gray)};
    }

    & svg {
        opacity: ${props => !props.active && '0.2'};
        height: 4em;
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
    justify-content: space-around;

    ${media.tablet} {
        flex-direction: column;
        align-items: center;
        height: 20%;
    }
`;

const NologinDiv = styled.div`
    display: flex;
    img {
        border-radius: 50%;
    }
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-top: 1em;
    margin-bottom: 1em;
    justify-content: space-around;

    & svg {
        display: none;
    }

    ${media.tablet} {
        & svg {
            display: block;
        }
        & span {
            display: none;
        }
        & button {
            border: none;
        }
    }
`;

const UserInfoDiv = styled.div`
    display: flex;
    align-items: center;

    & h4 {
        padding-left: 0.4em;
    }
    ${media.tablet} {
        & h4 {
            display: none;
        }
    }
`;

const LogoutDiv = styled.div``;

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

    ${media.tablet} {
        & h3 {
            display: none;
        }
    }
`;
export default Sidebar;
