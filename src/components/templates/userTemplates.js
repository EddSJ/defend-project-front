import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTemplates } from "../../redux/reducers/templates/templatesReducer";
import { getAdminTemplates, deleteTemplate } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import PoolCard from "./poolCard";


const UserTemplates = () => {
  const dispatch = useDispatch();
  const [pools, setPools] = useState([]);
  const { id } = useParams();
  

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAdminTemplates(id);
        dispatch(setTemplates(data));
        console.log('data de templates:', data);
        setPools(data);
      } catch (error) {
        console.error("Error al obtener templates:", error);
      }
    };

    fetchTemplates();

  }, [dispatch]);

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteTemplate(templateId);
      setPools((prevPools) => prevPools.filter((pool) => pool.id !== templateId));
    } catch (error) {
      console.error("Error al eliminar template:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {pools
          .filter((item) => item.isPublic)
          .map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <PoolCard pool={item} deleteAction={handleDeleteTemplate}/>
            </div>
          ))}
      </div>
    </div>
  );
}
export default UserTemplates;
