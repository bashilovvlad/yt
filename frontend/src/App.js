import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';

import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';

import MainNavigation from './components/Navigation/';

import AuthContext from './context/auth-context';

import './App.css';

const App = () => {
  const [cookies, setCookie] = useCookies(['token', 'userId']);

  const login = ({ token, userId, tokenExpiration }) => {
    if (token) {
      setCookie('token', token, { maxAge: 3600 });
      setCookie('userId', userId, { maxAge: 3600 });
    }
  };

  const logout = () => {
    setCookie('token', '');
    setCookie('userId', '');
  };

  return (
    <CookiesProvider>
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: cookies.token,
            userId: cookies.userId,
            login: login,
            logout: logout,
          }}
        >
          <MainNavigation />
          <main className='main'>
            <Switch>
              {cookies.token && <Redirect from='/' to='/events' exact />}
              {cookies.token && <Redirect from='/auth' to='/events ' exact />}
              {!cookies.token && <Route path='/auth' component={Auth}></Route>}
              <Route path='/events' component={Events}></Route>
              {cookies.token && (
                <Route path='/bookings' component={Bookings}></Route>
              )}
              {!cookies.token && <Redirect to='/auth' exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    </CookiesProvider>
  );
};

export default App;
