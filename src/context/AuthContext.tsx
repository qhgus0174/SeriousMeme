import { auth } from 'fbInstance';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';

interface IAuth {
    state: {
        init: boolean;
        authUser: User | null;
    };
}

export const AuthContext = createContext<IAuth>({ state: { init: false, authUser: null } });

const AuthProvider: React.FC = props => {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [init, setInit] = useState<boolean>(false);

    onAuthStateChanged(auth, (user: User | null) => {
        user ? setAuthUser(user) : setAuthUser(null);
        setInit(true);
    });

    return (
        <AuthContext.Provider value={{ state: { init: init, authUser: authUser } }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
