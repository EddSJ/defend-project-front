import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdmin } from "../../services/api";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';
import { translations } from '../translations';

const CreateAdminForm = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

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
      Swal.fire({
        icon: "success",
        title: t.createAdminForm.successCreatingAdmin,
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/users");
      });
    } catch (error) {
      console.error(t.createAdminForm.errorCreatingAdmin, error);
      Swal.fire({
        icon: "error",
        title: t.createAdminForm.errorCreatingAdmin,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="mb-0">{t.createAdminForm.createNewAdmin}</h2>
            </div>
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-bold">
                    {t.createAdminForm.name}
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="name"
                    placeholder={t.createAdminForm.enterName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="lastName" className="form-label fw-bold">
                    {t.createAdminForm.lastName}
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="lastName"
                    placeholder={t.createAdminForm.enterLastName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-bold">
                    {t.createAdminForm.email}
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    placeholder={t.createAdminForm.enterEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold">
                    {t.createAdminForm.password}
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    placeholder={t.createAdminForm.enterPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label fw-bold">
                    {t.createAdminForm.role}
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="ADMIN">{t.createAdminForm.admin}</option>
                    <option value="USER">{t.createAdminForm.user}</option>
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
                    {t.createAdminForm.blocked}
                  </label>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg fw-bold"
                  >
                    {t.createAdminForm.createAdmin}
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