import React, { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from 'routes/Main';

import Header from '~components/Layout/Header';
import Spinner from '~components/Spinner/spinner';

const AppRouter = () => {
    const { init } = useContext(AuthContext);

    return (
        <Router>
            <Header />
            {init && <Spinner />}
            <Route exact path="/" component={Main} />
        </Router>
    );
};

export default AppRouter;
