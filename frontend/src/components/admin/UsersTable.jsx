import { Pencil, Trash2, Ban, CheckCircle, Search } from "lucide-react";

function UsersTable({
  users,

  search,

  setSearch,

  openEdit,

  deleteUser,

  blockUser,

  unblockUser,
}) {
  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-700">
          👥 Registered Users
        </h2>

        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-4 text-gray-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user..."
            className="
            w-full
            pl-11
            pr-4
            py-3
            border
            rounded-xl
            focus:ring-2
            focus:ring-blue-500
            outline-none
            "
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-left">User</th>

              <th className="p-4 text-left">Contact</th>

              <th className="p-4 text-left">Blood</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  {/* User */}

                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          user.profileImage
                            ? `http://127.0.0.1:5000/profile-image/${user.profileImage}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=2563eb&color=fff`
                        }
                        alt="user"
                        className="
                        w-14
                        h-14
                        rounded-full
                        object-cover
                        border
                        "
                      />

                      <div>
                        <h3 className="font-semibold">{user.name}</h3>

                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}

                  <td className="p-4">
                    <div>
                      <p>📞 {user.phone || "-"}</p>

                      <p className="text-gray-500 text-sm">
                        Age : {user.age || "-"}
                      </p>
                    </div>
                  </td>

                  {/* Blood */}

                  <td className="p-4">{user.bloodGroup || "-"}</td>

                  {/* Status */}

                  <td className="p-4">
                    {user.status === "blocked" ? (
                      <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
                        🔴 Blocked
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                        🟢 Active
                      </span>
                    )}
                  </td>

                  {/* Actions */}

                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openEdit(user)}
                        className="
                        bg-yellow-500
                        hover:bg-yellow-600
                        text-white
                        p-3
                        rounded-xl
                        "
                      >
                        <Pencil size={18} />
                      </button>

                      {user.status === "blocked" ? (
                        <button
                          onClick={() => unblockUser(user._id)}
                          className="
                          bg-green-600
                          hover:bg-green-700
                          text-white
                          p-3
                          rounded-xl
                          "
                        >
                          <CheckCircle size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => blockUser(user._id)}
                          className="
                          bg-orange-600
                          hover:bg-orange-700
                          text-white
                          p-3
                          rounded-xl
                          "
                        >
                          <Ban size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteUser(user._id)}
                        className="
                        bg-red-600
                        hover:bg-red-700
                        text-white
                        p-3
                        rounded-xl
                        "
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersTable;
