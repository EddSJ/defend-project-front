import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTemplates } from "../../redux/reducers/templates/templatesReducer";
import { getTemplates } from '../../services/api';
import PoolCard from "./poolCard";
import SearchBar from "../common/searchBar";


const Templates = () => {
  const dispatch = useDispatch();
  const [pools, setPools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates(searchTerm);
        dispatch(setTemplates(data));
        console.log('data de templates:', data);
        setPools(data);
      } catch (error) {
        console.error("Error al obtener templates:", error);
      }
    };

    fetchTemplates();

  }, [dispatch, searchTerm]);

  const filteredPools = pools.filter((item) => 
    item.isPublic && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mt-4">
      <SearchBar
        placeholder={"Search"}
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
}
export default Templates;
