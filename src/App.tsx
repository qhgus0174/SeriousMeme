import React, { useContext } from 'react';
import AppRouter from 'Router';
import { GlobalStyle } from '~styles/global-styles';
import { basic } from '~styles/theme';
import AuthContext from '~context/AuthContext';
import SpinnerContext from '~context/SpinnerContext';
import { Flip, ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@emotion/react';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <ThemeProvider theme={basic}>
            <GlobalStyle />
            <SpinnerContext>
                <AuthContext>
                    <AppRouter />
                </AuthContext>
            </SpinnerContext>
            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover={false}
                transition={Flip}
                theme="dark"
                limit={5}
            />
        </ThemeProvider>
    );
};
export default App;
