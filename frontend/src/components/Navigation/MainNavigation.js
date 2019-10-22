import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

const MainNavigation = () => (
  <AuthContext.Consumer>
    {connext => {
      return (
        <header className='main-navigation'>
          <div className='main-navigation__logo'>Application</div>
          <nav className='main-navigation__item'>
            <ul className='main-navigation__list'>
              {!connext.token && (
                <li>
                  <NavLink to='/auth'>Authorization</NavLink>
                </li>
              )}
              <li>
                <NavLink to='/events'>Events</NavLink>
              </li>
              {connext.token && (
                <>
                  <li>
                    <NavLink to='/bookings'>Bookings</NavLink>
                  </li>
                  <li>
                    <button type='button' onClick={connext.logout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default MainNavigation;
