import React, { useEffect, useState } from 'react';
import { getTemplate, createTemplate } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PoolComments from './poolComments';
import Swal from 'sweetalert2';
import { translations } from '../translations';

const PoolShow = () => {
  const [pool, setPool] = useState({});
  const [responses, setResponses] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const adminId = useSelector((state) => state.admin.admin.id);
  const adminRole = useSelector((state) => state.admin.admin.role);
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const data = await getTemplate(id);
        console.log("esta es la data del template en show para sacar el admin: ", data);
        setPool(data);
      } catch (error) {
        console.error(t.poolShow.formError, error);
        Swal.fire({
          icon: "error",
          title: t.poolShow.formError,
          text: error.message || "Unknown error",
          confirmButtonText: "OK",
        });
      }
    };
    fetchTemplate();
  }, [id, t]);

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
        );
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
        );
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
      Swal.fire({
        icon: "success",
        title: t.poolShow.formSubmitted,
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(t.poolShow.formError, error);
      Swal.fire({
        icon: "error",
        title: t.poolShow.formError,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const adminOrCreator = () => {
    if (pool.adminId === adminId || adminRole === "ADMIN") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="card shadow-sm mb-4 p-4">
      <h1>{pool.name}</h1>
      <p>{pool.description}</p>
      <p><strong>{t.poolShow.createdBy}</strong> {pool.admin?.name}</p>

      <form>
        {pool.questions?.map((question) => (
          <div key={question.id} className="mb-3">
            <label className="form-label">{question.question}</label>
            {renderInput(question)}
            {`id del que creo el pool: ${pool.adminId}`}
            {`id del que esta logeado: ${adminId}`}
          </div>
        ))}
      </form>
      {!isAuthenticated ? (
        <button onClick={handleLoginRedirect} className="btn btn-warning mt-3">
          {t.poolShow.loginToAnswer}
        </button>
      ) : (
        <>
          <button onClick={handleSubmit} className="btn btn-success mt-3">
            {t.poolShow.submit}
          </button>
          <Link to={`/completed-templates/admin/${pool.id}`} className="btn btn-primary mt-3">
            {t.poolShow.viewResponses}
          </Link>
          {adminOrCreator() && (
            <Link to={`/template/${pool.id}/edit`} className="btn btn-primary mt-3">
              {t.poolShow.editTemplate}
            </Link>
          )}
        </>
      )}
      <button onClick={handleBack} className="btn btn-primary mt-3">
        {t.poolShow.backToHome}
      </button>
      <PoolComments />
    </div>
  );
};

export default PoolShow;