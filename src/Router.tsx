import React, { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from 'routes/Main';

import Header from '~components/Layout/Header';
import Spinner from '~components/Spinner/Spinner';

const AppRouter = () => {
    const {
        state: { init },
    } = useContext(AuthContext);

    return (
        <Router>
            <Header />
            <Spinner visible={!init} />
            <Route exact path="/" component={Main} />
        </Router>
    );
};

export default AppRouter;
