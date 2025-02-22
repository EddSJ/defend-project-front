import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTemplates } from "../../redux/reducers/templates/templatesReducer";
import { getAdminTemplates, deleteTemplate } from '../../services/api';
import { useParams } from 'react-router-dom';
import PoolCard from "./poolCard";
import SearchBar from "../common/searchBar";
import Swal from 'sweetalert2';
import { translations } from '../translations';

const UserTemplates = () => {
  const dispatch = useDispatch();
  const [pools, setPools] = useState([]);
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAdminTemplates(id, searchTerm);
        dispatch(setTemplates(data));
        console.log('data de templates:', data);
        setPools(data);
      } catch (error) {
        console.error(t.userTemplates.errorFetchingTemplates, error);
        Swal.fire({
          icon: "error",
          title: t.userTemplates.errorFetchingTemplates,
          text: error.message || "Unknown error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchTemplates();
  }, [dispatch, searchTerm, id, t]);

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteTemplate(templateId);
      setPools((prevPools) => prevPools.filter((pool) => pool.id !== templateId));
      Swal.fire({
        icon: "success",
        title: "Template deleted successfully!",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(t.userTemplates.errorDeletingTemplate, error);
      Swal.fire({
        icon: "error",
        title: t.userTemplates.errorDeletingTemplate,
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
    }
  };

  const filteredPools = pools.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <SearchBar
        placeholder={t.userTemplates.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="row">
        {filteredPools.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <PoolCard pool={item} deleteAction={handleDeleteTemplate} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTemplates;