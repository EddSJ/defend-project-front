import React, { useState } from "react";
import { createPool } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Swal from "sweetalert2";
import { translations } from '../translations';

const CreatePoll = () => {
  const currentAdminId = useSelector((state) => state.admin.admin.id);
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    name: "",
    description: "",
    isPublic: true,
    questions: [],
    adminId: null,
  });

  const [question, setQuestion] = useState({
    text: "",
    type: "TEXT",
    options: [],
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

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
      Swal.fire({
        icon: "warning",
        title: t.createTemplate.maxQuestions,
        text: `${t.createTemplate.maxQuestions} ${question.type}.`,
        confirmButtonText: "OK",
      });
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
      const response = await createPool(template);
      console.log("Template creado:", response);
      Swal.fire({
        icon: "success",
        title: t.createTemplate.success,
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error(t.createTemplate.error, error);
      Swal.fire({
        icon: "error",
        title: t.createTemplate.error,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">{t.createTemplate.createTemplateButton}</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          <label className="form-label">{t.createTemplate.templateName}</label>
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
          <label className="form-label">{t.createTemplate.description}</label>
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
          <label className="form-check-label">{t.createTemplate.publicTemplate}</label>
        </div>

        <div className="form-section">
          <label className="form-label">{t.createTemplate.question}</label>
          <input
            type="text"
            name="text"
            className="form-control"
            value={question.text}
            onChange={handleQuestionChange}
          />
        </div>
        <div className="form-section">
          <label className="form-label">{t.createTemplate.questionType}</label>
          <select
            name="type"
            className="form-select"
            value={question.type}
            onChange={handleQuestionChange}
            required
          >
            <option value="TEXT">{t.createTemplate.optionsSelection.text}</option>
            <option value="NUMBER">{t.createTemplate.optionsSelection.number}</option>
            <option value="TEXTAREA">{t.createTemplate.optionsSelection.textArea}</option>
            <option value="CHECKBOX">{t.createTemplate.optionsSelection.options}</option>
          </select>
        </div>
        {question.type === "CHECKBOX" && (
          <div className="form-section">
            <label className="form-label">{t.createTemplate.options}</label>
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
              {t.createTemplate.addOption}
            </button>
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={addQuestion}
        >
          {t.createTemplate.addQuestion}
        </button>

        <div className="mt-4">
          <h3>{t.createTemplate.addedQuestions}</h3>
          {template.questions.map((q, index) => (
            <div key={index} className="mb-3">
              <p>
                <strong>{t.createTemplate.question} {index + 1}:</strong>
                <input
                  type="text"
                  className="form-control"
                  value={q.text}
                  onChange={(e) => handleEditQuestion(index, 'text', e.target.value)}
                />
              </p>
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
          {t.createTemplate.createTemplateButton}
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;