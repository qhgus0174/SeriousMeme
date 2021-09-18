import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import TextBox from '~components/Input/TextBox';
import Button from '~components/Button/Button';
import SvgIcon from '~components/Icon/SvgIcon';
import Tab from '~components/Tab/Tab';
import { AuthContext } from '~context/AuthContext';
import { auth } from '~firebase/firebaseInstance';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { toast } from 'react-toastify';

const Login = () => {
    const {
        state: { authUser },
    } = useContext(AuthContext);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [newAccount, setNewAccount] = useState<boolean>(false);
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

    const onChangeLoginInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value, name },
        } = event;
        if (name == 'email') {
            setEmail(value);
        } else if (name == 'password') {
            setPassword(value);
        }
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        let data;
        try {
            if (newAccount) {
                //creat new Account
                data = await createUserWithEmailAndPassword(auth, email, password)
                    .then(res => {
                        toast('계정이 생성되었습니다.');
                    })
                    .catch((err: unknown) => {
                        const { message } = err as Error;

                        if (message.includes('email-already-in-use')) {
                            toast.error('이미 가입 된 계정 입니다.');
                        } else {
                            toast.error('계정 생성 중 오류가 발생했습니다.');
                        }
                    });
            } else {
                //Login
                data = await signInWithEmailAndPassword(auth, email, password)
                    .then(res => {
                        toast('로그인 되었습니다.');
                    })
                    .catch(() => {
                        toast.error('로그인 중 오류가 발생했습니다.');
                    });
            }
            console.log(data);
        } catch (err: unknown) {
            //https://firebase.google.com/docs/auth/admin/errors?hl=ko
            const { message } = err as Error;
            console.log(message);

            let returnMsg = '';

            if (message.includes('user-not-found')) {
                returnMsg = '사용자를 찾을 수 없습니다.';
            } else if (message.includes('weak-password')) {
                returnMsg = '비밀번호 길이가 너무 짧습니다.';
            } else if (message.includes('wrong-password')) {
                returnMsg = '이메일 또는 아이디가 잘못되었습니다.';
            }
            toast.error(returnMsg);
        }
    };

    const onClickLoginSns = (event: React.MouseEvent<HTMLButtonElement>) => {
        const {
            currentTarget: { name },
        } = event;

        switch (name) {
            case 'google':
                signInWithPopup(auth, new GoogleAuthProvider())
                    .then(() => {
                        toast('로그인 되었습니다.');
                    })
                    .catch(() => {
                        toast.error('로그인 중 오류가 발생했습니다.');
                    });
                break;
            case 'github':
                signInWithPopup(auth, new GithubAuthProvider())
                    .then(() => {
                        toast('로그인 되었습니다.');
                    })
                    .catch(() => {
                        toast.error('로그인 중 오류가 발생했습니다.');
                    });
                break;
        }
    };

    const toggleAccount = (index: number) => {
        setSelectedTabIndex(index);
        setNewAccount(index == 0 ? false : true);
    };

    return (
        <LoginContainer className="loginContainer">
            <Tab currIndex={selectedTabIndex} onClickTab={toggleAccount} titles={['SIGN IN', 'CREATE ACCOUNT']} />

            <form onSubmit={onSubmit}>
                <LoginContent className="loginContent">
                    <TextBox
                        className="textBox"
                        onChange={onChangeLoginInput}
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={email}
                    />
                    <TextBox
                        className="textBox"
                        onChange={onChangeLoginInput}
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={password}
                    />
                    <LoginButton type="submit">{newAccount ? 'Create Account' : 'Sign In'}</LoginButton>
                </LoginContent>
            </form>
            <LoginButtonContainer className="loginButtonContainer">
                <SnsLoginButton
                    className="button"
                    name="google"
                    icon={<SvgIcon shape="googleLogo" />}
                    onClick={onClickLoginSns}
                >
                    Continue with Google
                </SnsLoginButton>
                <SnsLoginButton
                    name="github"
                    className="button"
                    icon={<SvgIcon shape="github" />}
                    onClick={onClickLoginSns}
                >
                    Continue with Github
                </SnsLoginButton>
            </LoginButtonContainer>
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
`;

const LoginContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
`;

const LoginButtonContainer = styled.div`
    display: flex;
    padding-top: 1.1em;
    box-sizing: border-box;
    justify-content: center;
`;

const SnsLoginButton = styled(Button)(props => ({
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    boxSizing: 'border-box',
    backgroundColor: props.theme.colors.tertiary,

    '&:hover': {
        backgroundColor: props.theme.colors.tertiaryDark,
    },
}));

const LoginButton = styled(Button)`
    margin-top: 0.5rem;
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
`;

const ErrorMsg = styled.span`
    color: ${props => props.theme.colors.warning};
`;

export default Login;
