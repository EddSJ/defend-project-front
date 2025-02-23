import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/reducers/auth/authReducer';
import { validateToken, getAdmin } from '../../services/api';
import { setAdmin } from '../../redux/reducers/admins/adminReducer';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { translations } from '../translations';
import { setLang } from '../../redux/reducers/lang';

const Navbar = () => {
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const adminRole = useSelector((state) => state.admin.admin.role);
  const currentAdminId = useSelector((state) => state.admin.admin.id);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminId');
    dispatch(setAdmin({}));
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'en';
    dispatch(setLang(savedLang));
  }, [dispatch]);

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
      };
      checkToken();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAndSetAdmin = async () => {
        const storedAdminId = localStorage.getItem('adminId');
        try {
          const data = await getAdmin(storedAdminId);
          console.log("data desde el header ", data);
          dispatch(setAdmin(data));
        } catch (error) {
          console.error("Error al obtener admin:", error);
        }
      };
      fetchAndSetAdmin();
    }
  }, [isAuthenticated, dispatch]);

  const changeLang = () => {
    const newLang = currentLang === "en" ? "es" : "en";
    dispatch(setLang(newLang));
    localStorage.setItem('lang', newLang);
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
          {t.navBar.home}
        </Link>
        {!isAuthenticated && (
          <>
            <Link to="/login" className="navbar-link">
              {t.navBar.signIn}
            </Link>
            <Link to="/register" className="navbar-link">
              {t.navBar.signUp}
            </Link>
          </>
        )}
        {isAuthenticated && (
          <>
            <Link to={`/templates/admin/${currentAdminId}`} className="navbar-link">
              {t.navBar.polls}
            </Link>
            <button onClick={handleLogout} className="navbar-link logout-button">
              {t.navBar.signOut}
            </button>
            {adminRole === 'ADMIN' && (
              <Link to="/users" className="navbar-link">
                {t.navBar.users}
              </Link>
            )}
          </>
        )}
        <button onClick={changeLang} className="navbar-link lang-button">
          <FontAwesomeIcon icon={faEarthAmericas} /> {t.common.lang}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;