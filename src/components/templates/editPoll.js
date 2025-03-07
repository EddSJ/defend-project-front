import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getTemplate, editTempplate } from "../../services/api";
import Swal from "sweetalert2";
import { translations } from '../translations';

const EditPoll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentAdminId = useSelector((state) => state.admin.admin.id);
  const currentAdminRole = useSelector((state) => state.admin.admin.role);
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await getTemplate(id);
        setTemplate(response);
      } catch (error) {
        console.error(t.editTemplate.errorLoading, error);
        Swal.fire({
          icon: "error",
          title: t.editTemplate.errorLoading,
          text: error.message || "Unknown error",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [id, navigate, t]);

  useEffect(() => {
    if (!loading && template) {
      if (currentAdminId !== template.adminId && currentAdminRole !== "ADMIN") {
        Swal.fire({
          icon: "warning",
          title: t.editTemplate.unauthorized,
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      }
    }
  }, [template, loading, currentAdminId, currentAdminRole, navigate, t]);

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

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...template.questions];
    newQuestions[questionIndex].options.push(""); 
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      questions: newQuestions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, createdAt, updatedAt, ...templateData } = template;
      templateData.adminId = currentAdminId;

      await editTempplate(id, templateData);
      Swal.fire({
        icon: "success",
        title: t.editTemplate.success,
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error(t.editTemplate.error, error);
      Swal.fire({
        icon: "error",
        title: t.editTemplate.error,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  if (loading) {
    return <p>{t.editTemplate.loading}</p>;
  }

  if (!template) {
    return <p>{t.editTemplate.errorLoading}</p>;
  }

  return (
    <div className="edit-template-container">
      <h1 className="text-center mb-4">{t.editTemplate.saveChanges}</h1>
      <form onSubmit={handleSubmit} className="edit-template-form">
        <div className="form-section">
          <label className="form-label">{t.editTemplate.templateName}</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={template.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-section">
          <label className="form-label">{t.editTemplate.description}</label>
          <textarea
            name="description"
            className="form-control"
            value={template.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-section form-check">
          <input
            type="checkbox"
            name="isPublic"
            className="form-check-input"
            checked={template.isPublic}
            onChange={handleInputChange}
          />
          <label className="form-check-label">{t.editTemplate.publicTemplate}</label>
        </div>
        <div className="questions-section">
          <h3>{t.editTemplate.questions}</h3>
          {template.questions.map((q, index) => (
            <div key={q.id} className="question-item">
              <p>
                <strong>{t.editTemplate.questions} {index + 1}:</strong>
                <input
                  type="text"
                  className="form-control"
                  value={q.question}
                  onChange={(e) => handleEditQuestion(index, "question", e.target.value)}
                />
              </p>
              <label className="form-label">{t.editTemplate.questionType}</label>
              <select
                className="form-select"
                value={q.type}
                onChange={(e) => handleEditQuestion(index, "type", e.target.value)}
              >
                <option value="TEXT">Texto</option>
                <option value="NUMBER">Número</option>
                <option value="TEXTAREA">Área de texto</option>
                <option value="CHECKBOX">{t.editTemplate.multipleOptions}</option>
              </select>
              {q.type === "CHECKBOX" && (
                <div>
                  <ul className="options-list">
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
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddOption(index)}
                  >
                    {t.editTemplate.addOption}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success submit-button">
          {t.editTemplate.saveChanges}
        </button>
      </form>
    </div>
  );
};

export default EditPoll;