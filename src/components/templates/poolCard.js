import React from 'react';
import { Link } from 'react-router-dom';

const PoolCard = (props) => {
  const {name, description, questions, id} = props.pool;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">ID: {id}</h6>
        <p className="card-text">{description}</p>
        <p className="card-text">
          <small className="text-muted">Número de preguntas: {questions.length}</small>
        </p>

        <div className="mt-3" style={{ height: "200px", overflowY: "auto" }}>
          <h6>Preguntas:</h6>
          <ul className="list-group">
            {questions.slice(0, 3).map((question, index) => (
              <li key={question.id} className="list-group-item">
                <strong>{index + 1}.</strong> {question.question} <br />
              </li>
            ))}
            {questions.length > 3 && (
              <li className="list-group-item text-muted">
                <small>+ {questions.length - 3} preguntas más...</small>
              </li>
            )}
          </ul>
        </div>
        <Link to={`/templates/${id}`} className="btn btn-primary mt-3">
          Ver más
        </Link>
      </div>
    </div>
  );
}
export default PoolCard;
