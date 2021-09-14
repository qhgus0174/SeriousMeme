import React, { useEffect, useState } from 'react';
import AppRouter from 'Router';
import { fbAuthService, fbAuth } from 'fbInstance';
import { GlobalStyle } from '~styles/global-styles';

import { basic } from '~styles/theme';
import { ThemeProvider, useTheme } from '@emotion/react';

const App = () => {
    //currentUser : 로그인 안 했으면 null 값임
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [init, setInit] = useState<boolean>(false);
    const theme = useTheme();

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

    return (
        <ThemeProvider theme={basic}>
            <GlobalStyle />
            <AppRouter />
            {/* {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initializing...'} */}
        </ThemeProvider>
    );
};
export default App;
