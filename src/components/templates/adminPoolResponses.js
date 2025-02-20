import React, { useState, useEffect } from 'react';
import { getCompletedTemplates } from '../../services/api';
import { useParams } from 'react-router-dom';
import PoolResponse from './poolResponse';
import { useSelector } from 'react-redux';

const AdminPoolResponses = () => {
  const [completedTemplates, setCompletedTemplates] = useState([]);
  const { id } = useParams();
  const currentUser = useSelector(state => state.admin.admin);

  useEffect(() => {
    const fetchCompletedTemplates = async () => {
      try {
        const data = await getCompletedTemplates(id);
        setCompletedTemplates(data);
        console.log("data desde el template responses: ", data);
      } catch (error) {
        console.error("Error al obtener templates completados:", error);
      }
    };

    fetchCompletedTemplates();
  }, [id]);

  const filteredTemplates = completedTemplates.filter(response => 
    currentUser.role === 'ADMIN' || response.template.adminId === currentUser.id || response.adminId === currentUser.id
  );

  return (
    <div className="container mt-4">
      <div className="row">
        {filteredTemplates.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <PoolResponse pool={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPoolResponses;
