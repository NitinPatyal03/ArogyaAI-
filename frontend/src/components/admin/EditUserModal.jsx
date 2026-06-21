function EditUserModal({
  showEdit,

  setShowEdit,

  editUser,

  setEditUser,

  updateUser,
}) {
  if (!showEdit) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl w-[500px] p-8 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6">✏ Edit User</h2>

        <div className="space-y-4">
          <input
            value={editUser.name}
            onChange={(e) =>
              setEditUser({
                ...editUser,

                name: e.target.value,
              })
            }
            placeholder="Name"
            className="w-full border rounded-xl p-3"
          />

          <input
            value={editUser.phone}
            onChange={(e) =>
              setEditUser({
                ...editUser,

                phone: e.target.value,
              })
            }
            placeholder="Phone"
            className="w-full border rounded-xl p-3"
          />

          <input
            value={editUser.age}
            onChange={(e) =>
              setEditUser({
                ...editUser,

                age: e.target.value,
              })
            }
            placeholder="Age"
            className="w-full border rounded-xl p-3"
          />

          <input
            value={editUser.bloodGroup}
            onChange={(e) =>
              setEditUser({
                ...editUser,

                bloodGroup: e.target.value,
              })
            }
            placeholder="Blood Group"
            className="w-full border rounded-xl p-3"
          />

          <select
            value={editUser.gender}
            onChange={(e) =>
              setEditUser({
                ...editUser,

                gender: e.target.value,
              })
            }
            className="w-full border rounded-xl p-3"
          >
            <option>Male</option>

            <option>Female</option>

            <option>Other</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setShowEdit(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={updateUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;
