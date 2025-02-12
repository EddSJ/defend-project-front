import React, { useState, useEffect } from 'react';
import { getCompletedTemplates } from '../../services/api';
import { useParams } from 'react-router-dom';
import PoolResponse from './poolResponse';

const AdminPoolResponses = () => {
  const [ completedTemplates, setCompletedTemplates ] = useState([]);
  const { id } = useParams();
  

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
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        {completedTemplates.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <PoolResponse pool={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default AdminPoolResponses;
