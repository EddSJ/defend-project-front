import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/reducers/auth/authReducer';
import { validateToken, getAdmin } from '../../services/api';
import { setAdmin } from '../../redux/reducers/admins/adminReducer';

const Navbar = ( ) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const adminRole = useSelector((state) => state.admin.admin.role);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    dispatch(setAdmin({}));
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const checkToken = async () => {
        try {
          const response = await validateToken();
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('adminId');
            dispatch(logout());
          }
        } catch (error) {
          console.error("Error al validar token:", error);
        }
      }
      checkToken();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAdnSetAdmin = async () => {
        const storedAdminId = localStorage.getItem('adminId');
        try {
          const data = await getAdmin(storedAdminId);
          console.log("data desde el header ", data);
          dispatch(setAdmin(data));
        } catch (error) {
          console.error("Error al obtener admin:", error);
        };
      };
      fetchAdnSetAdmin();
    }
  }, [isAuthenticated, dispatch]);


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
            {adminRole === 'ADMIN' && (
              <Link to="/users" className="navbar-link">
                Users
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;