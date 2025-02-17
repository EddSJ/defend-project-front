import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdmin } from "../../services/api";

const CreateAdminForm = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createAdmin({
        name,
        lastName,
        email,
        password,
        role,
        isBlocked,
      });
      console.log("Admin creado:", response);
      navigate("/users");
    } catch (error) {
      console.error("Error al crear administrador:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="mb-0">Create New Admin</h2>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-bold">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="lastName" className="form-label fw-bold">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="lastName"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-bold">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label fw-bold">
                    Role
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                  </select>
                </div>

                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isBlocked"
                    checked={isBlocked}
                    onChange={(e) => setIsBlocked(e.target.checked)}
                  />
                  <label htmlFor="isBlocked" className="form-check-label fw-bold">
                    Blocked
                  </label>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg fw-bold"
                  >
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdminForm;