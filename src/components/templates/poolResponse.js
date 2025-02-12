import React from 'react';
import { Link } from 'react-router-dom';

const PoolResponse = (props) => {
  const { template, admin, answers } = props.pool;

  const questions = [
    { id: 1, question: "Pregunta 1" },
    { id: 2, question: "Pregunta 2" },
    { id: 3, question: "Pregunta 3" },
    // Agrega más preguntas si es necesario
  ];

  // Función para obtener la pregunta basada en el questionId
  const getQuestionText = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.question : "Pregunta no encontrada";
  };


  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">{template.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Respondido por: {admin.name} {admin.lastName}</h6>
        <p className="card-text">{template.description}</p>
        <p className="card-text">
          <small className="text-muted">Número de respuestas: {answers.length}</small>
        </p>

        <div className="mt-3" style={{ height: "200px", overflowY: "auto" }}>
          <h6>Respuestas:</h6>
          <ul className="list-group">
            {answers.slice(0, 3).map((answer, index) => (
              <li key={answer.id} className="list-group-item">
                <strong>{index + 1}.</strong> {getQuestionText(answer.questionId)} <br />
                <strong>Respuesta:</strong> {answer.answer}
              </li>
            ))}
            {answers.length > 3 && (
              <li className="list-group-item text-muted">
                <small>+ {answers.length - 3} respuestas más...</small>
              </li>
            )}
          </ul>
        </div>
        <Link to={`/templates/${template.id}`} className="btn btn-primary mt-3">
          Ver más
        </Link>
      </div>
    </div>
  );
}
export default PoolResponse;