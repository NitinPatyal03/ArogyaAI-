import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import AdminStats from "./components/admin/AdminStats";
import UsersTable from "./components/admin/UsersTable";
import EditUserModal from "./components/admin/EditUserModal";

import {
  fetchUsers,
  fetchAppointments,
  fetchHistory,
  deleteUser,
  blockUser,
  unblockUser,
  updateUser,
} from "./components/admin/adminApi";

function AdminDashboard() {
  const navigate = useNavigate();

  // --------------------
  // States
  // --------------------

  const [users, setUsers] = useState([]);

  const [appointments, setAppointments] = useState([]);

  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");

  const [showEdit, setShowEdit] = useState(false);

  const [editUser, setEditUser] = useState({
    _id: "",

    name: "",

    phone: "",

    age: "",

    bloodGroup: "",

    gender: "",
  });

  // --------------------
  // Authentication
  // --------------------

  useEffect(() => {
    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");

      return;
    }

    if (role !== "admin") {
      toast.error("Unauthorized Access");

      navigate("/");
    }
  }, [navigate]);

  // --------------------
  // Load Data
  // --------------------

  const loadUsers = () => fetchUsers(setUsers);

  useEffect(() => {
    loadUsers();

    fetchAppointments(setAppointments);

    fetchHistory(setHistory);
  }, []);

  // --------------------
  // Edit Modal
  // --------------------

  const openEdit = (user) => {
    setEditUser({
      _id: user._id,

      name: user.name || "",

      phone: user.phone || "",

      age: user.age || "",

      bloodGroup: user.bloodGroup || "",

      gender: user.gender || "",
    });

    setShowEdit(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
      {/* Header */}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold text-blue-700">
            👨‍⚕️ Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-2">ArogyaAI Administration Panel</p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-6
          py-3
          rounded-2xl
          "
        >
          🏠 Back Home
        </button>
      </div>

      {/* Statistics */}

      <AdminStats users={users} appointments={appointments} history={history} />

      {/* Users */}

      <UsersTable
        users={users}
        search={search}
        setSearch={setSearch}
        openEdit={openEdit}
        deleteUser={(id) => deleteUser(id, loadUsers)}
        blockUser={(id) => blockUser(id, loadUsers)}
        unblockUser={(id) => unblockUser(id, loadUsers)}
      />

      {/* Edit Modal */}

      <EditUserModal
        showEdit={showEdit}
        setShowEdit={setShowEdit}
        editUser={editUser}
        setEditUser={setEditUser}
        updateUser={() =>
          updateUser(
            editUser,

            loadUsers,

            () => setShowEdit(false),
          )
        }
      />
    </div>
  );
}

export default AdminDashboard;
