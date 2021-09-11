import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from 'routes/Main';

import Header from '~components/Layout/Header';

const AppRouter = () => (
    <Router>
        <Header />
        <Route exact path="/" component={Main} />
    </Router>
);

export default AppRouter;
