import React from 'react';
import AppRouter from 'Router';
import { GlobalStyle } from '~styles/global-styles';
import { basic } from '~styles/theme';
import { ThemeProvider } from '@emotion/react';
import AuthContext from './context/AuthContext';

const App = () => {
    return (
        <ThemeProvider theme={basic}>
            <AuthContext>
                <GlobalStyle />
                <AppRouter />
            </AuthContext>
        </ThemeProvider>
    );
};
export default App;
