import React, { useContext, useEffect } from 'react';
import { AuthContext } from 'context/AuthContext';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from 'routes/Main';
import Profile from 'routes/Profile';
import Header from '~components/Layout/Header';
import { SpinnerContext } from '~context/SpinnerContext';
import ModalContext from '~context/ModalContext';
import PrivateRoute from 'PrivateRouter';

const AppRouter = () => {
    const {
        state: { init },
    } = useContext(AuthContext);

    const { setSpinnerVisible } = useContext(SpinnerContext);

    useEffect(() => {
        init ? setSpinnerVisible(false) : setSpinnerVisible(true);
    }, [init]);

    return init ? (
        <BrowserRouter>
            <ModalContext>
                <Header />
                <Route exact path="/" component={Main} />
                <PrivateRoute exact path="/profile" component={Profile} />
            </ModalContext>
        </BrowserRouter>
    ) : (
        <></>
    );
};

export default AppRouter;
