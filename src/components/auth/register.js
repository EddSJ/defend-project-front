import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/api";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { translations } from '../translations';

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(name, lastName, email, password, role);
      console.log(response);
      Swal.fire({
        icon: "success",
        title: t.registerForm.registerTitle,
        text: "User registered successfully!",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error(t.registerForm.registerError, error);
      Swal.fire({
        icon: "error",
        title: t.registerForm.registerError,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">{t.registerForm.registerTitle}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t.registerForm.name}
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder={t.registerForm.enterName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                {t.registerForm.lastName}
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder={t.registerForm.enterLastName}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                {t.registerForm.email}
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder={t.registerForm.enterEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                {t.registerForm.password}
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={t.registerForm.enterPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {t.registerForm.registerButton}
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p>
              {t.registerForm.alreadyHaveAccount}{" "}
              <button type="button" onClick={() => navigate("/login")}>
                {t.registerForm.loginHere}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;