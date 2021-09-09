import React, { useEffect, useState } from 'react';
import AppRouter from '~components/Router';
import { fbAuthService, fbAuth } from 'fbInstance';

const App = () => {
    //currentUser : 로그인 안 했으면 null 값임
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [init, setInit] = useState<boolean>(false);

    useEffect(() => {
        fbAuthService.onAuthStateChanged(fbAuth, user => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            setInit(true);
        });
    }, []);

    return <>{init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing...'}</>;
};
export default App;
