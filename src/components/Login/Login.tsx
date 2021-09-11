import { fbAuthService, fbAuth } from 'fbInstance';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import TextBox from '~components/Input/TextBox';
import Button from '~components/Button/Button';
import SvgIcon from '~components/Icon/SvgIcon';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(true);

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
                data = await fbAuthService.createUserWithEmailAndPassword(fbAuth, email, password);
            } else {
                //Login
                data = await fbAuthService.signInWithEmailAndPassword(fbAuth, email, password);
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const onClickLoginSns = (event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const toggleAccount = () => {
        // /
    };

    return (
        <LoginContainer className="loginContainer">
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
                    <input value={newAccount ? 'Create Account' : 'Log In'} type="submit" />
                    <span onClick={toggleAccount}></span>
                </LoginContent>
            </form>
            <LoginButtonContainer className="loginButtonContainer">
                <Button className="button" icon={<SvgIcon shape="googleLogo" />} onClick={() => onClickLoginSns}>
                    Continue with Google
                </Button>
                <Button className="button" icon={<SvgIcon shape="github" />} onClick={() => onClickLoginSns}>
                    Continue with Github
                </Button>
            </LoginButtonContainer>
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const LoginContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
`;

const LoginButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 1em;
`;
export default Auth;
