import { Users, CalendarDays, Activity, AlertTriangle } from "lucide-react";

function AdminStats({
  users,

  appointments,

  history,
}) {
  const criticalCases = history.filter(
    (item) => item.severity === "Critical",
  ).length;

  const activeUsers = users.filter((user) => user.status !== "blocked").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      {/* Total Users */}

      <div className="bg-white rounded-3xl shadow-xl p-6 hover:-translate-y-1 transition">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Users</p>

            <h2 className="text-4xl font-bold text-blue-600 mt-3">
              {users.length}
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              {activeUsers} Active Users
            </p>
          </div>

          <div className="bg-blue-100 p-4 rounded-2xl">
            <Users size={40} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Appointments */}

      <div className="bg-white rounded-3xl shadow-xl p-6 hover:-translate-y-1 transition">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">Appointments</p>

            <h2 className="text-4xl font-bold text-green-600 mt-3">
              {appointments.length}
            </h2>

            <p className="text-sm text-gray-400 mt-2">Doctor Visits</p>
          </div>

          <div className="bg-green-100 p-4 rounded-2xl">
            <CalendarDays size={40} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Predictions */}

      <div className="bg-white rounded-3xl shadow-xl p-6 hover:-translate-y-1 transition">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">Predictions</p>

            <h2 className="text-4xl font-bold text-purple-600 mt-3">
              {history.length}
            </h2>

            <p className="text-sm text-gray-400 mt-2">Disease Reports</p>
          </div>

          <div className="bg-purple-100 p-4 rounded-2xl">
            <Activity size={40} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Critical Cases */}

      <div className="bg-white rounded-3xl shadow-xl p-6 hover:-translate-y-1 transition">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">Critical Cases</p>

            <h2 className="text-4xl font-bold text-red-600 mt-3">
              {criticalCases}
            </h2>

            <p className="text-sm text-gray-400 mt-2">Need Attention</p>
          </div>

          <div className="bg-red-100 p-4 rounded-2xl">
            <AlertTriangle size={40} className="text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStats;
