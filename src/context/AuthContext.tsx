import { authService } from 'fbInstance';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';

interface IAuth {
    init: boolean;
    authUser: User | null;
}

export const AuthContext = createContext<IAuth>({ init: false, authUser: null });

const AuthProvider: React.FC = props => {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [init, setInit] = useState<boolean>(false);

    useEffect(() => {
        onAuthStateChanged(authService, user => {
            user ? setAuthUser(user) : setAuthUser(null);
            setInit(true);
        });
    }, []);

    return <AuthContext.Provider value={{ init: init, authUser: authUser }}>{props.children}</AuthContext.Provider>;
};

export default AuthProvider;
