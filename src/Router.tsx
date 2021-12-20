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
import { Helmet } from 'react-helmet';

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
                    <Helmet>
                        <title>인간극장 짤 생성기</title>
                        <meta name="description" content="웹 페이지에서 편하게 인간극장 짤을 생성해보세요!" />
                        <meta
                            name="keywords"
                            content="인간극장, 인간극장 짤, 인간극장 짤 생성기, 짤 생성기, 짤 만들기"
                        />
                        <meta property="og:type" content="website" />
                        <meta property="og:title" content="인간극장 짤 생성기" />
                        <meta property="og:description" content="웹 페이지에서 편하게 인간극장 짤을 생성해보세요!" />
                        <meta property="og:locale" content="ko_KR" />
                        <meta property="og:url" content="https://qhgus0174.github.io/SeriousMeme/" />
                    </Helmet>
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
