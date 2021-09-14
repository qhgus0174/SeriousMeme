import { authService } from 'fbInstance';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import TextBox from '~components/Input/TextBox';
import Button from '~components/Button/Button';
import SvgIcon from '~components/Icon/SvgIcon';
import Tab from '~components/Tab/Tab';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(false);
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
                data = await createUserWithEmailAndPassword(authService, email, password);
            } else {
                //Login
                data = await signInWithEmailAndPassword(authService, email, password);
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const onClickLoginSns = (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                        type="text"
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
                    icon={<SvgIcon shape="googleLogo" />}
                    onClick={() => onClickLoginSns}
                >
                    Continue with Google
                </SnsLoginButton>
                <SnsLoginButton className="button" icon={<SvgIcon shape="github" />} onClick={() => onClickLoginSns}>
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

export default Auth;
