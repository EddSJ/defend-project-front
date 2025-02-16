import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/reducers/auth/authReducer';

const Navbar = ( ) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          MiApp
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Inicio
        </Link>
        {!isAuthenticated && (
          <>
            <Link to="/login" className="navbar-link">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="navbar-link">
              Registrarse
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to="/templates" className="navbar-link">
              Plantillas
            </Link>
            <button onClick={handleLogout} className="navbar-link logout-button">
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;