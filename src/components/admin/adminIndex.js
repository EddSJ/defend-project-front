import React, { useEffect, useState } from "react";
import ActionToolbar from "./actionToolBar";
import { getAdmins, blockAdmins, unblockAdmins, deleteAdmins } from "../../services/api";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';
import { translations } from '../translations';

const AdminIndex = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);
  const currentLang = useSelector((state) => state.lang.lang);
  const t = translations[currentLang];

  const handleAction = async (action) => {
    try {
      const usersToAction = selectedUsers;  
      let response;
      if (action === "block") {
        response = await blockAdmins({ adminIds: usersToAction });
      } else if (action === "unblock") {
        response = await unblockAdmins({ adminIds: usersToAction });
      } else if (action === "delete") {
        response = await deleteAdmins({ adminIds: usersToAction });
      }  
      setAdmins(response);
      setSelectedUsers([]);
      Swal.fire({
        icon: "success",
        title: `Admins ${action}ed successfully!`,
        confirmButtonText: "OK",
      });
    } catch (error) {
      setError(t.adminIndex.error.replace("{action}", action));
      Swal.fire({
        icon: "error",
        title: t.adminIndex.error.replace("{action}", action),
        text: error.message || "Unknown error",
        confirmButtonText: "Try Again",
      });
      console.error("Error handling action: ", error);
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await getAdmins();
        setAdmins(response);
      } catch (error) {
        console.error("Error fetching admins: ", error);
        Swal.fire({
          icon: "error",
          title: "Error fetching admins",
          text: error.message || "Unknown error",
          confirmButtonText: "OK",
        });
      }
    };
    fetchAdmins();
  }, []);

  return (
    <div className="container mt-4">
      <ActionToolbar
        selectedUsers={selectedUsers}
        onAction={handleAction}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedUsers(
                      e.target.checked ? admins.map((admin) => admin.id) : []
                    )
                  }
                />
                <label>{t.adminIndex.selectAll}</label>
              </th>
              <th>{t.adminIndex.name}</th>
              <th>{t.adminIndex.email}</th>
              <th>{t.adminIndex.lastName}</th>
              <th>{t.adminIndex.role}</th>
              <th>{t.adminIndex.status}</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(admin.id)}
                    onChange={(e) => {
                      setSelectedUsers((prev) =>
                        e.target.checked
                          ? [...prev, admin.id]
                          : prev.filter((id) => id !== admin.id)
                      );
                    }}
                  />
                </td>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.lastName}</td>
                <td>{admin.role}</td>
                <td>{admin.isBlocked ? t.adminIndex.blocked : t.adminIndex.active}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminIndex;