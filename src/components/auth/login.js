import React, {  useState } from 'react';
import { signin } from '../../services/api';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../../redux/reducers/auth/authReducer';
import { setAdmin } from '../../redux/reducers/admins/adminReducer';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signin(email, password);
      dispatch(setAdmin(response.admin));
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("adminId", response.admin.id);
      dispatch(login());
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p>
              Don't have an account?{" "}
              <button type="button" onClick={() => navigate("/register")}>
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login;
