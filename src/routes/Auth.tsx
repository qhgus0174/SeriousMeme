import { fbAuthService, fbAuth } from 'fbInstance';
import React, { useState } from 'react';
import tw from 'twin.macro';
import styled from '@emotion/styled/macro';

const CustomButton = styled.button([tw`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`]);

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
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChangeLoginInput} type="text" name="email" placeholder="Email" required value={email} />
                <input onChange={onChangeLoginInput} type="password" name="password" placeholder="Password" required value={password} />
                <input value={newAccount ? 'Create Account' : 'Log In'} type="submit" />
                <span onClick={toggleAccount}></span>
            </form>
            <div>
                <CustomButton onClick={() => onClickLoginSns}>Continue with Google</CustomButton>
                <button onClick={() => onClickLoginSns}>Continue with Github</button>
            </div>
        </div>
    );
};
export default Auth;
