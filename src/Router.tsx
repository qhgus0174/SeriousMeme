import React, { useContext, useEffect } from 'react';
import { AuthContext } from 'context/AuthContext';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Main from 'routes/Main';

import Header from '~components/Layout/Header';
import { SpinnerContext } from '~context/SpinnerContext';

const AppRouter = () => {
    const {
        state: { init },
    } = useContext(AuthContext);

    const { setVisible } = useContext(SpinnerContext);

    useEffect(() => {
        init ? setVisible(false) : setVisible(true);
    }, [init]);

    return (
        <Router>
            <Header />
            <Route exact path="/" component={Main} />
        </Router>
    );
};

export default AppRouter;
