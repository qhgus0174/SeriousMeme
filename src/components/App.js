import React, { useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbInstance';

const App = () => {
    //currentUser : 로그인 안 했으면 null 값임
    const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

    return <AppRouter isLoggedIn={isLoggedIn} />;
};
export default App;
