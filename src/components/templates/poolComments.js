import React, { useEffect, useState } from 'react';
import { getComments, createComment } from '../../services/api';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PoolComments = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(''); 
  const { id } = useParams();
  const adminId = useSelector((state) => state.admin.admin.id);
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(id);
        console.log('data:', data);
        setComments(data);
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
      }
    };
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const data = {
      authorId: adminId,
      content: newComment,
    };

    console.log('data:', data);
    try {

      const response = await createComment(id, data);
      setComments([...comments, response]);
      setNewComment('');
    } catch (error) {
      console.error("Error al crear comentario:", error);
    }
  };

  const fullName = (author) => {
    return `${author.name} ${author.lastName}`;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div className="mt-4">
      { isAuthenticated && (
        <>
          <h3>Comentarios</h3>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Escribe tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit} className="btn btn-primary mt-2">
              Enviar Comentario
            </button>
          </div>
        </>
      )}
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="card mb-2">
            <div className="card-body">
              <p className="card-text">{comment.content}</p>
              <div className="d-flex justify-content-between">
                <small className="text-muted">Por: {fullName(comment.author)}</small>
                <small className="text-muted">Creado: {formatDate(comment.createdAt)}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoolComments;