import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import TextBox from '~components/Input/TextBox';
import Button from '~components/Button/Button';
import SvgIcon from '~components/Icon/SvgIcon';
import Tab from '~components/Tab/Tab';
import { auth } from '~firebase/firebaseInstance';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithRedirect,
} from 'firebase/auth';
import { toast } from 'react-toastify';
import { SpinnerContext } from '~context/SpinnerContext';
import { useHistory } from 'react-router';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [newAccount, setNewAccount] = useState<boolean>(false);
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const history = useHistory();
    const { setSpinnerVisible } = useContext(SpinnerContext);

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

        setSpinnerVisible(true);

        try {
            newAccount
                ? await createUserWithEmailAndPassword(auth, email, password)
                : await signInWithEmailAndPassword(auth, email, password);
            history.push('/');
        } catch (err: unknown) {
            const { message } = err as Error;

            if (message.includes('email-already-in-use')) {
                toast.error('이미 가입 된 계정 입니다.');
            } else if (message.includes('user-not-found')) {
                toast.error('사용자를 찾을 수 없습니다.');
            } else if (message.includes('weak-password')) {
                toast.error('비밀번호 길이가 너무 짧습니다.');
            } else if (message.includes('wrong-password')) {
                toast.error('이메일 또는 아이디가 잘못되었습니다.');
            } else {
                console.log(message);
                toast.error('계정 생성 중 오류가 발생했습니다.');
            }
        } finally {
            setSpinnerVisible(false);
        }
    };

    const onClickLoginSns = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const {
            currentTarget: { name },
        } = event;

        setSpinnerVisible(true);
        try {
            await signInWithRedirect(auth, name === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider());
            history.push('/');
        } catch {
            toast.error('로그인 중 오류가 발생했습니다.');
        } finally {
            setSpinnerVisible(false);
        }
    };

    const toggleAccount = (index: number) => {
        setSelectedTabIndex(index);
        setNewAccount(index == 0 ? false : true);
    };

    return (
        <LoginContainer>
            <Tab currIndex={selectedTabIndex} onClickTab={toggleAccount} titles={['SIGN IN', 'CREATE ACCOUNT']} />

            <form onSubmit={onSubmit}>
                <LoginContent>
                    <TextBox
                        onChange={onChangeLoginInput}
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={email}
                    />
                    <TextBox
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
            <LoginButtonContainer>
                <SnsLoginButton
                    color="orange"
                    name="google"
                    icon={<SvgIcon shape="googleLogo" />}
                    onClick={onClickLoginSns}
                >
                    Continue with Google
                </SnsLoginButton>
                <SnsLoginButton
                    color="orange"
                    name="github"
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
}));

const LoginButton = styled(Button)`
    margin-top: 0.5rem;
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
`;

export default Login;
