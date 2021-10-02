import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AuthContext } from '~context/AuthContext';

interface PrivateRouteProps extends RouteProps {
    component: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, ...rest } = props;

    const {
        state: { authUser },
    } = useContext(AuthContext);

    return <Route {...rest} render={routeProps => (authUser ? <Component {...routeProps} /> : <Redirect to="/" />)} />;
};

export default PrivateRoute;
