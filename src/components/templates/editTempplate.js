import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTemplate, editTempplate } from "../../services/api";

const EditTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentAdminId = useSelector((state) => state.admin.admin.id);
  const currentAdminRole = useSelector((state) => state.admin.admin.role);

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await getTemplate(id);
        setTemplate(response);
      } catch (error) {
        console.error("Error al obtener la plantilla:", error);
        alert("No se pudo cargar la plantilla");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, navigate]);

  useEffect(() => {
    if (!loading && template) {
      if (currentAdminId !== template.adminId && currentAdminRole !== "ADMIN") {
        navigate("/");
      }
    }
  }, [template, loading, currentAdminId, currentAdminRole, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditQuestion = (index, field, value) => {
    const newQuestions = [...template.questions];
    newQuestions[index][field] = value;
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      questions: newQuestions,
    }));
  };

  const handleEditOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...template.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      questions: newQuestions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      template.adminId = currentAdminId;
      await editTempplate(id, template);
      alert("Plantilla actualizada exitosamente");
      navigate("/");
    } catch (error) {
      console.error("Error al actualizar la plantilla:", error);
      alert("Hubo un error al actualizar la plantilla");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!template) {
    return <p>Error al cargar la plantilla.</p>;
  }

  return (
    <div className="container mt-4">
      <h1>Editar Plantilla</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre de la plantilla</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={template.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            value={template.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            name="isPublic"
            className="form-check-input"
            checked={template.isPublic}
            onChange={handleInputChange}
          />
          <label className="form-check-label">Plantilla pública</label>
        </div>
        <div className="mt-4">
          <h3>Preguntas</h3>
          {template.questions.map((q, index) => (
            <div key={q.id} className="mb-3">
              <p>
                <strong>Pregunta {index + 1}:</strong>
                <input
                  type="text"
                  className="form-control"
                  value={q.question}
                  onChange={(e) => handleEditQuestion(index, "question", e.target.value)}
                />
              </p>
              <label className="form-label">Tipo de pregunta</label>
              <select
                className="form-select"
                value={q.type}
                onChange={(e) => handleEditQuestion(index, "type", e.target.value)}
              >
                <option value="TEXT">Texto</option>
                <option value="NUMBER">Número</option>
                <option value="TEXTAREA">Área de texto</option>
                <option value="CHECKBOX">Múltiples opciones</option>
              </select>
              {q.type === "CHECKBOX" && (
                <ul>
                  {q.options.map((option, idx) => (
                    <li key={idx}>
                      <input
                        type="text"
                        className="form-control"
                        value={option}
                        onChange={(e) => handleEditOption(index, idx, e.target.value)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success mt-3">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditTemplate;
