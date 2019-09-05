import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';

import MainNavigation from './components/Navigation/MainNavigation';

import AuthContext from './context/auth-context';

import './App.css';

class App extends React.Component {
  state = {
    token: null,
    userId: null,
  };

  login = (token, userId, tokenExpiration) => {
    if (token) {
      this.setState({ token, userId });
    }
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNavigation />
          <main className='main'>
            <Switch>
              {this.state.token && <Redirect from='/' to='/events' exact />}
              {this.state.token && (
                <Redirect from='/auth' to='/events ' exact />
              )}
              {!this.state.token && (
                <Route path='/auth' component={Auth}></Route>
              )}
              <Route path='/events' component={Events}></Route>
              {this.state.token && (
                <Route path='/bookings' component={Bookings}></Route>
              )}
              {!this.state.token && <Redirect to='/auth' exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;