import React from 'react';
import AppRouter from 'Router';
import { GlobalStyle } from '~styles/global-styles';
import { basic } from '~styles/theme';
import { ThemeProvider } from '@emotion/react';
import AuthContext from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalContext from 'context/ModalContext';

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
