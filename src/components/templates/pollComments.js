import React, { useEffect, useState } from 'react';
import { getComments, createComment } from '../../services/api';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { translations } from '../translations';

const PollComments = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(''); 
  const { id } = useParams();
  const adminId = useSelector((state) => state.admin.admin.id);
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(id);
        console.log('data:', data);
        setComments(data);
      } catch (error) {
        console.error(t.poolComments.errorFetchingComments, error);
        Swal.fire({
          icon: "error",
          title: t.poolComments.errorFetchingComments,
          text: error.message || "Unknown error",
          confirmButtonText: "OK",
        });
      }
    };
    fetchComments();
  }, [id, t]);

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
      console.error(t.poolComments.errorCreatingComment, error);
      Swal.fire({
        icon: "error",
        title: t.poolComments.errorCreatingComment,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const fullName = (author) => {
    return `${author.name} ${author.lastName}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="pool-comments-container">
      { isAuthenticated && (
        <>
          <h3 className="comments-title">{t.poolComments.comments}</h3>
          <div className="comment-form">
            <textarea
              className="comment-input"
              rows="3"
              placeholder={t.poolComments.writeComment}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit} className="btn btn-primary send-button">
              {t.poolComments.sendComment}
            </button>
          </div>
        </>
      )}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="comment-body">
              <p className="comment-text">{comment.content}</p>
              <div className="comment-footer">
                <small className="comment-author">{t.poolComments.by} {fullName(comment.author)}</small>
                <small className="comment-date">{t.poolComments.createdAt} {formatDate(comment.createdAt)}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollComments;