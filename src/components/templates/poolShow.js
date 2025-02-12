import React, { useEffect, useState } from 'react';
import { getTemplate, createTemplate, getAdmin, validateToken } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAdmin } from '../../redux/reducers/admins/adminReducer';
import { logout } from '../../redux/reducers/auth/authReducer';
import { Link } from 'react-router-dom';

const PoolShow = () => {
  const dispatch = useDispatch();
  const [pool, setPool] = useState({});
  const [adminId, setAdminId] = useState(null);
  const [responses, setResponses] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
    const fetchTemplate = async () => {
      try {
        const data = await getTemplate(id);
        setPool(data);
      } catch (error) {
        console.error("Error al obtener template:", error);
      }
    };
    if (isAuthenticated) {
      const fetchAndSetAdmin = async () => {
        const storedAdminId = localStorage.getItem('adminId');
        try {
          const data = await getAdmin(storedAdminId);
          console.log(data)
          setAdminId(data.id);
          dispatch(setAdmin(data));
        } catch (error) {
          console.error("Error al obtener admin:", error);
        }
      };
      fetchAndSetAdmin();
    }
    fetchTemplate();
  }, [id]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const renderInput = (question) => {
    switch (question.type) {
      case 'NUMBER':
        return (
          <input
            type="number"
            disabled={!isAuthenticated}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        );
      case 'TEXTAREA':
        return (
          <textarea
            disabled={!isAuthenticated}
            className="form-control"
            rows="3"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        )
      case 'CHECKBOX':
        return (
          <div>
            {question.options?.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  type="radio"
                  disabled={!isAuthenticated}
                  className="form-check-input"
                  id={`option-${index}`}
                  name={`question-${question.id}`}
                  value={option}
                  checked={responses[question.id] === option}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                />
                <label className="form-check-label" htmlFor={`option-${index}`}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <input
            type="text"
            disabled={!isAuthenticated}
            className="form-control"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        )
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSubmit = async () => {
    const answers = Object.keys(responses).map((questionId) => ({
      questionId: parseInt(questionId),
      answer: responses[questionId],
    }));
    const data = {
      templateId: parseInt(pool.id),
      adminId: adminId,
      answers,
    };
    try {
      const response = await createTemplate(data);
      console.log('Respuesta del servidor:', response);
      setResponses({});
      alert('Formulario enviado correctamente');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un error al enviar el formulario');
    }
  };

  return (
    <div className="card shadow-sm mb-4 p-4">
      <h1>{pool.name}</h1>
      <p>{pool.description}</p>
      <p><strong>Creado por:</strong> {pool.admin?.name}</p>

      <form>
        {pool.questions?.map((question) => (
          <div key={question.id} className="mb-3">
            <label className="form-label">{question.question}</label>
            {renderInput(question)}
          </div>
        ))}
      </form>
      {!isAuthenticated ? (
        <button onClick={handleLoginRedirect} className="btn btn-warning mt-3">
          Iniciar Sesión para Contestar Encuesta
        </button>
      ) : (
        <>
          <button onClick={handleSubmit} className="btn btn-success mt-3">
            Enviar
          </button>
          <Link to={`/completed-templates/admin/${pool.id}`} className="btn btn-primary mt-3">
            Ver respuestas de la plantilla   
          </Link>
        </>
      )}
      <button onClick={handleBack} className="btn btn-primary mt-3">
        Volver al inicio
      </button>
    </div>
  );
};

export default PoolShow;