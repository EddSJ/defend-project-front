import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTemplates } from "../../redux/reducers/templates/templatesReducer";
import { getAdminTemplates, deleteTemplate } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import PoolCard from "./poolCard";
import SearchBar from "../common/searchBar";


const UserTemplates = () => {
  const dispatch = useDispatch();
  const [pools, setPools] = useState([]);
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAdminTemplates(id, searchTerm);
        dispatch(setTemplates(data));
        console.log('data de templates:', data);
        setPools(data);
      } catch (error) {
        console.error("Error al obtener templates:", error);
      }
    };

    fetchTemplates();

  }, [dispatch, searchTerm]);

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteTemplate(templateId);
      setPools((prevPools) => prevPools.filter((pool) => pool.id !== templateId));
    } catch (error) {
      console.error("Error al eliminar template:", error);
    }
  };
 
  const filteredPools = pools.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mt-4">
      <SearchBar
        placeholder="Buscar templates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="row">
        {filteredPools.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <PoolCard pool={item} deleteAction={handleDeleteTemplate}/>
          </div>
        ))}
      </div>
    </div>
  );
}
export default UserTemplates;
