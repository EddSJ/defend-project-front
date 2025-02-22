import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTemplates } from "../../redux/reducers/templates/templatesReducer";
import { getTemplates } from '../../services/api';
import PoolCard from "./poolCard";
import SearchBar from "../common/searchBar";
import Swal from 'sweetalert2';
import { translations } from '../translations';

const Templates = () => {
  const dispatch = useDispatch();
  const [pools, setPools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates(searchTerm);
        dispatch(setTemplates(data));
        console.log('data de templates:', data);
        setPools(data);
      } catch (error) {
        console.error(t.templates.errorFetchingTemplates, error);
        Swal.fire({
          icon: "error",
          title: t.templates.errorFetchingTemplates,
          text: error.message || "Unknown error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchTemplates();
  }, [dispatch, searchTerm, t]);

  const filteredPools = pools.filter((item) => 
    item.isPublic && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <SearchBar
        placeholder={t.templates.searchPlaceholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="row">
        {filteredPools.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <PoolCard pool={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;