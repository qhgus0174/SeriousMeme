import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from 'routes/Home';
import Auth from 'routes/Auth';
import Main from 'routes/Main';

import Header from '~components/Layout/Header';

const AppRouter = ({ isLoggedIn }: { isLoggedIn?: boolean }) => (
    <Router>
        <Header />
        <Route exact path="/" component={Main} />
        {/* <Route exact path="/" component={isLoggedIn ? Home : Auth} /> */}
    </Router>
);

export default AppRouter;
