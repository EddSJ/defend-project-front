import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTemplates } from "../../redux/reducers/templates/templatesReducer";
import { getTemplates } from '../../services/api';
import PoolCard from "./poolCard";


const Templates = () => {
  const dispatch = useDispatch();
  const [pools, setPools] = React.useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates();
        dispatch(setTemplates(data));
        console.log('data de templates:', data);
        setPools(data);
      } catch (error) {
        console.error("Error al obtener templates:", error);
      }
    };

    fetchTemplates();

  }, [dispatch]);

  return (
    <div className="container mt-4">
      <div className="row">
        {pools
          .filter((item) => item.isPublic)
          .map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <PoolCard pool={item} />
            </div>
          ))}
      </div>
    </div>
  );
}
export default Templates;
