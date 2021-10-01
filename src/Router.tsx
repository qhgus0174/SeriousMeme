import React, { useContext, useEffect } from 'react';
import { AuthContext } from 'context/AuthContext';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from 'routes/Main';
import List from 'routes/List';
import Profile from 'routes/Profile';
import Header from '~components/Layout/Header';
import { SpinnerContext } from '~context/SpinnerContext';
import ModalContext from '~context/ModalContext';
import PrivateRoute from 'PrivateRouter';
import Sidebar from '~components/Layout/Sidebar';
import styled from '@emotion/styled';

const AppRouter = () => {
    const {
        state: { init },
    } = useContext(AuthContext);

    const { setSpinnerVisible } = useContext(SpinnerContext);

    useEffect(() => {
        init ? setSpinnerVisible(false) : setSpinnerVisible(true);
    }, [init]);

    return init ? (
        <BrowserRouter basename="SeriousMeme">
            <Container>
                <ModalContext>
                    <Sidebar />
                    <Route exact path="/" component={Main} />
                    <Route exact path="/list" component={List} />
                    <PrivateRoute exact path="/profile" component={Profile} />
                </ModalContext>
            </Container>
        </BrowserRouter>
    ) : (
        <></>
    );
};

const Container = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
`;

export default AppRouter;
