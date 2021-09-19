import React, { useContext } from 'react';
import AppRouter from 'Router';
import { GlobalStyle } from '~styles/global-styles';
import { basic } from '~styles/theme';
import AuthContext from '~context/AuthContext';
import ModalContext from '~context/ModalContext';
import SpinnerContext from '~context/SpinnerContext';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@emotion/react';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <ThemeProvider theme={basic}>
            <GlobalStyle />
            <AuthContext>
                <ModalContext>
                    <SpinnerContext>
                        <AppRouter />
                    </SpinnerContext>
                </ModalContext>
            </AuthContext>
            <ToastContainer />
        </ThemeProvider>
    );
};
export default App;
