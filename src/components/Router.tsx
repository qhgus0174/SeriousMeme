import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Home from '../routes/Home';
import Auth from '../routes/Auth';

const AppRouter = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
    <Router>
        <Route exact path="/">
            {isLoggedIn ? <Home /> : <Auth />}
        </Route>
    </Router>
);

export default AppRouter;
