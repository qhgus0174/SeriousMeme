import { fbAuthService, fbAuth } from 'fbInstance';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import Text from '~components/Input/Text';
import Button from '~components/Button/Button';
import GitHubIcon from '@material-ui/icons/GitHub';

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
        console.log('ab');
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
        console.log('hi');
        event.preventDefault();
    };

    const toggleAccount = () => {
        // /
    };

    return (
        <LoginContainer>
            <form onSubmit={onSubmit}>
                <LoginContent>
                    <Text
                        onChange={onChangeLoginInput}
                        type="text"
                        name="email"
                        placeholder="Email"
                        required
                        value={email}
                    />
                    <Text
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
            <LoginButtonContainer>
                <Button icon={<GitHubIcon />} onClick={() => onClickLoginSns}>
                    Continue with Google
                </Button>
                <Button onClick={() => onClickLoginSns}>Continue with Github</Button>
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
    padding: 1em;
`;
export default Auth;
