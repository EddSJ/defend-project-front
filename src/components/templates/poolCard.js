import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommenting, faTrash } from '@fortawesome/free-solid-svg-icons'
import { likeTemplate, unlikeTemplate } from '../../services/api';
import { useSelector } from 'react-redux';

const PoolCard = (props) => {
  const { name, description, questions, id, likes, likedBy, comments } = props.pool;
  const [currentLikes, setLikes] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const adminId = useSelector((state) => state.admin.admin.id);
  

  useEffect(() => {
    const userId = adminId;
    console.log('Like de admin:', userId);
    const userHasLiked = likedBy.some(user => user.id === userId);
    setHasLiked(userHasLiked);
  }, [isAuthenticated, likedBy, adminId]);

  const handleLike = async () => {
    if (hasLiked) {
      alert('Ya has dado like a esta encuesta');
      return;
    }

    try {
      const data = {
        userId: adminId
      }
      const response = await likeTemplate(id, data);
      setLikes(response.likes);
      setHasLiked(true);
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  }

  const handleUnlike = async () => {
    try {
      const data = {
        userId: adminId
      }
      const response = await unlikeTemplate(id, data);
      setLikes(response.likes);
      setHasLiked(false);
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  }

  const deleteTemplate = () => {
    props.deleteAction(id)
  }


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
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Link to={`/templates/${id}`} className="btn btn-primary me-2">
            Ver más
          </Link>
          <button
            disabled={!isAuthenticated}
            onClick={hasLiked ? handleUnlike : handleLike}
            className={`btn ${hasLiked ? 'btn-danger' : 'btn-outline-danger'} me-2`}
          >
            <FontAwesomeIcon icon={faHeart} /> {currentLikes}
          </button>
          <div className="d-flex align-items-center ">
            <FontAwesomeIcon icon={faCommenting} className="me-2" />
            <span>{comments.length}</span>
          </div>
          {props.deleteAction &&
            <div onClick={deleteTemplate} className="d-flex align-items-center trash">
              <FontAwesomeIcon icon={faTrash} className="me-2" />
            </div>
          }
        </div>
      </div>
    </div>
  );
}
export default PoolCard;
<FontAwesomeIcon icon={faTrash} className="me-2" />

