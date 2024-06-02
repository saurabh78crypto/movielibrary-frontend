import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const {isLoggedIn, logout} = useAuth();

    const isSignInPage = location.pathname === '/signin';
    const isRegisterPage = location.pathname === '/signup';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">MovieLibrary</Link>
        {!isLoggedIn? (
        <>
          {!isSignInPage && !isRegisterPage && <Link to="/signin" className='navbar-signin'>Sign In</Link>}
          {isSignInPage && <Link to="/signup" className='navbar-signin'>Register Now</Link>}
          {isRegisterPage && <Link to="/signin" className='navbar-signin'>Sign In</Link>}
          
        </>
        ) : (
          <Link to='/signin' onClick={logout} className='navbar-signin'>Logout</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
