import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommenting, faTrash } from '@fortawesome/free-solid-svg-icons';
import { likeTemplate, unlikeTemplate } from '../../services/api';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { translations } from '../translations';

const PollCard = (props) => {
  const { name, description, questions, id, likes, likedBy, comments } = props.pool;
  const [currentLikes, setLikes] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const adminId = useSelector((state) => state.admin.admin.id);
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

  useEffect(() => {
    const userId = adminId;
    console.log('Like de admin:', userId);
    const userHasLiked = likedBy.some(user => user.id === userId);
    setHasLiked(userHasLiked);
  }, [isAuthenticated, likedBy, adminId]);

  const handleLike = async () => {
    if (hasLiked) {
      Swal.fire({
        icon: "warning",
        title: t.pollCard.alreadyLiked,
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const data = {
        userId: adminId
      };
      const response = await likeTemplate(id, data);
      setLikes(response.likes);
      setHasLiked(true);
    } catch (error) {
      console.error(t.pollCard.likeError, error);
      Swal.fire({
        icon: "error",
        title: t.pollCard.likeError,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleUnlike = async () => {
    try {
      const data = {
        userId: adminId
      };
      const response = await unlikeTemplate(id, data);
      setLikes(response.likes);
      setHasLiked(false);
    } catch (error) {
      console.error(t.pollCard.unlikeError, error);
      Swal.fire({
        icon: "error",
        title: t.pollCard.unlikeError,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const deleteTemplate = () => {
    props.deleteAction(id);
  };

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
          <h6>{t.pollCard.questions}:</h6>
          <ul className="list-group">
            {questions.slice(0, 3).map((question, index) => (
              <li key={question.id} className="list-group-item">
                <strong>{index + 1}.</strong> {question.question} <br />
              </li>
            ))}
            {questions.length > 3 && (
              <li className="list-group-item text-muted">
                <small>{t.pollCard.moreQuestions.replace('{count}', questions.length - 3)}</small>
              </li>
            )}
          </ul>
        </div>
        <div className="card-action">
          <Link to={`/templates/${id}`} className="btn btn-primary me-2">
            {t.pollCard.viewMore}
          </Link>
          <button
            disabled={!isAuthenticated}
            onClick={hasLiked ? handleUnlike : handleLike}
            className={`btn ${hasLiked ? 'btn-danger' : 'btn-outline-danger'} me-2`}
          >
            <FontAwesomeIcon icon={faHeart} /> {currentLikes}
          </button>
          <div className="d-flex align-items-center">
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
};

export default PollCard;