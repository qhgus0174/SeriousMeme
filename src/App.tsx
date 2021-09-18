import React from 'react';
import AppRouter from 'Router';
import { GlobalStyle } from '~styles/global-styles';
import { basic } from '~styles/theme';
import AuthContext from '~context/AuthContext';
import ModalContext from '~context/ModalContext';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@emotion/react';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <ThemeProvider theme={basic}>
            <GlobalStyle />
            <AuthContext>
                <ModalContext>
                    <AppRouter />
                </ModalContext>
            </AuthContext>
            <ToastContainer />
        </ThemeProvider>
    );
};
export default App;
