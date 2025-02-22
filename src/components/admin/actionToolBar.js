import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { translations } from "../translations";
import { useSelector } from "react-redux";

const ActionToolbar = ({ selectedUsers, onAction }) => {
  const currentLang = useSelector((state) => state.lang.lang);
  const  t = translations[currentLang];

  return (
    <div className="toolbar">
      <button onClick={() => onAction("block")}>
        <FontAwesomeIcon icon={faLock} /> {t.common.block}
      </button>
      <button onClick={() => onAction("unblock")}>
        <FontAwesomeIcon icon={faUnlock} />
      </button>
      <button className="delete" onClick={() => onAction("delete")}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
      <Link to="/user" className="navbar-link">
        <FontAwesomeIcon icon={faPlus} />
      </Link>
    </div>
  );
};
export default ActionToolbar;
