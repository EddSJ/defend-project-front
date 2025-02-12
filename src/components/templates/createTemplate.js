import React, { useState, useEffect } from "react";
import { createPool, getAdmin, validateToken } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/reducers/auth/authReducer';
import { setAdmin } from '../../redux/reducers/admins/adminReducer';


const CreateTemplate = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [currentAdminId, setCurrentAdminId] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
  
      if (token) {
        const checkToken = async () => {
          try {
            console.log('nunca pasa por aqui')
            const response = await validateToken();
            console.log('Esta es la respuesta del servidor:', response);
            if (response.status === 401) {
              localStorage.removeItem('token');
              dispatch(logout());
            }
          } catch (error) {
            console.error('Error al validar token:', error);
          }
        }
        checkToken();
      }
    }, []);

    useEffect(() => {
      if (isAuthenticated) {
        const fetchAndSetAdmin = async () => {
          const storedAdminId = localStorage.getItem('adminId');
          try {
            const data = await getAdmin(storedAdminId);
            console.log(data)
            setCurrentAdminId(data.id);
            dispatch(setAdmin(data));
          } catch (error) {
            console.error("Error al obtener admin:", error);
          }
        };
        fetchAndSetAdmin();
      }
    }, [])

  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    name: "",
    description: "",
    isPublic: true,
    questions: [],
    adminId: null
  });

  const [question, setQuestion] = useState({
    text: "",
    type: "TEXT",
    options: [],
  });

  // Maneja cambios en los campos del template (nombre, descripción, isPublic)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Maneja cambios en los campos de la pregunta (texto, tipo, opciones)
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  // Maneja cambios en las opciones de preguntas de tipo CHECKBOX
  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: newOptions,
    }));
  };

  const addOption = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ""],
    }));
  };

  const addQuestion = () => {
    const countByType = template.questions.filter(
      (q) => q.type === question.type
    ).length;

    if (countByType >= 4) {
      alert(`No puedes agregar más de 4 preguntas del tipo ${question.type}.`);
      return;
    }

    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      questions: [...prevTemplate.questions, question],
    }));

    setQuestion({
      text: "",
      type: "TEXT",
      options: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      template.adminId = currentAdminId;
      const response = await createPool(template);
      console.log("Template creado:", response);
      alert("Plantilla creada exitosamente");
      navigate("/");
    } catch (error) {
      console.error("Error al crear la plantilla:", error);
      alert("Hubo un error al crear la plantilla");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Crear Plantilla</h1>
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

        {/* Campos de la pregunta */}
        <div className="mb-3">
          <label className="form-label">Pregunta</label>
          <input
            type="text"
            name="text"
            className="form-control"
            value={question.text}
            onChange={handleQuestionChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de pregunta</label>
          <select
            name="type"
            className="form-select"
            value={question.type}
            onChange={handleQuestionChange}
            required
          >
            <option value="TEXT">Texto</option>
            <option value="NUMBER">Número</option>
            <option value="TEXTAREA">Área de texto</option>
            <option value="CHECKBOX">Checkbox</option>
          </select>
        </div>
        {question.type === "CHECKBOX" && (
          <div className="mb-3">
            <label className="form-label">Opciones</label>
            {question.options.map((option, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={addOption}
            >
              Agregar Opción
            </button>
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={addQuestion}
        >
          Agregar Pregunta
        </button>

        <div className="mt-4">
          <h3>Preguntas agregadas</h3>
          {template.questions.map((q, index) => (
            <div key={index} className="mb-3">
              <p>
                <strong>Pregunta {index + 1}:</strong> {q.text} ({q.type})
              </p>
              {q.type === "CHECKBOX" && (
                <ul>
                  {q.options.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-success mt-3">
          Crear Plantilla
        </button>
      </form>
    </div>
  );
};

export default CreateTemplate;