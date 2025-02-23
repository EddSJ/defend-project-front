import React, { useState } from 'react';
import { signin } from '../../services/api';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../../redux/reducers/auth/authReducer';
import { setAdmin } from '../../redux/reducers/admins/adminReducer';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { translations } from '../translations';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signin(email, password);
      dispatch(setAdmin(response.admin));
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("adminId", response.admin.id);
      dispatch(login());
      navigate("/");
    } catch (error) {
      console.error(t.login.loginError, error);
      Swal.fire({
        icon: "error",
        title: t.login.loginError,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">{t.login.loginTitle}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                {t.login.email}
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder={t.login.enterEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                {t.login.password}
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={t.login.enterPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {t.login.loginButton}
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p>
              {t.login.noAccount}{" "}
              <button type="button" onClick={() => navigate("/register")}>
                {t.login.registerHere}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;