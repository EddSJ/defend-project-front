import React from 'react';
import { Link } from 'react-router-dom';

const PoolResponse = (props) => {
  const { template, admin, answers } = props.pool;

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
            {answers.map((answer, index) => (
              <li key={answer.id} className="list-group-item">
                <strong>{index + 1}.</strong> <br />
                <strong>Respuesta:</strong> {answer.answer}
              </li>
            ))}
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