import React, { useEffect, useState } from 'react';
import { getTemplate, createTemplate } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PoolComments from './poolComments';

const PoolShow = () => {
  const [pool, setPool] = useState({});
  const [responses, setResponses] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const adminId = useSelector((state) => state.admin.admin.id);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await getTemplate(id);
        setPool(data);
      } catch (error) {
        console.error("Error al obtener template:", error);
      }
    };
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
      <PoolComments />
    </div>
  );
};

export default PoolShow;