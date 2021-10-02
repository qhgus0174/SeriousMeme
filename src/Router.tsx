import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PrivateRoute from 'PrivateRouter';
import styled from '@emotion/styled';
import { AuthContext } from '~context/AuthContext';
import { SpinnerContext } from '~context/SpinnerContext';
import ModalContext from '~context/ModalContext';
import Sidebar from '~components/Layout/Sidebar';
import { media } from '~styles/device';
import Main from '~routes/Main';
import List from '~routes/List';
import Profile from '~routes/Profile';

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

    ${media.phone} {
        margin-bottom: 20%;
    }
`;

export default AppRouter;
