import { useEffect, useState } from "react";

import {
  FaHeartbeat,
  FaExclamationTriangle,
  FaChartLine,
  FaNotesMedical,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

function Dashboard() {
  const [history, setHistory] = useState([]);

  // -----------------------------------
  // Fetch Prediction History
  // -----------------------------------
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("https://arogyaai-backend-wudu.onrender.com/history");

      const data = await response.json();

      setHistory(data);
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------------
  // Severity Counts
  // -----------------------------------
  const criticalCount = history.filter(
    (item) => item.severity === "Critical",
  ).length;

  const highCount = history.filter((item) => item.severity === "High").length;

  const mediumCount = history.filter(
    (item) => item.severity === "Medium",
  ).length;

  const lowCount = history.filter((item) => item.severity === "Low").length;

  // -----------------------------------
  // Chart Data
  // -----------------------------------
  const severityData = [
    {
      name: "Critical",
      value: Number(criticalCount) || 0,
    },

    {
      name: "High",
      value: Number(highCount) || 0,
    },

    {
      name: "Medium",
      value: Number(mediumCount) || 0,
    },

    {
      name: "Low",
      value: Number(lowCount) || 0,
    },
  ];

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold text-blue-700">
            📊 Health Analytics Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Real-time AI healthcare analytics
          </p>
        </div>

        {/* Back Button */}
        <a
          href="/"
          className="
          mt-4 md:mt-0
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-6
          py-3
          rounded-2xl
          shadow-lg
          transition
          duration-300
          "
        >
          🏠 Back Home
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Total Predictions */}
        <div className="bg-white p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <FaHeartbeat className="text-blue-600 text-3xl" />

            <h2 className="text-xl font-bold text-gray-700">
              Total Predictions
            </h2>
          </div>

          <p className="text-5xl font-bold text-blue-600">{history.length}</p>
        </div>

        {/* Critical */}
        <div className="bg-red-500 text-white p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle className="text-3xl" />

            <h2 className="text-xl font-bold">Critical Cases</h2>
          </div>

          <p className="text-5xl font-bold">{criticalCount}</p>
        </div>

        {/* High */}
        <div className="bg-orange-400 text-black p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <FaChartLine className="text-3xl" />

            <h2 className="text-xl font-bold">High Severity</h2>
          </div>

          <p className="text-5xl font-bold">{highCount}</p>
        </div>

        {/* Medium */}
        <div className="bg-yellow-300 text-black p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <FaNotesMedical className="text-3xl" />

            <h2 className="text-xl font-bold">Medium Severity</h2>
          </div>

          <p className="text-5xl font-bold">{mediumCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl h-[450px]">
          <h2 className="text-2xl font-bold mb-6">Severity Distribution</h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {severityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        {/* Bar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl h-[450px]">
          <h2 className="text-2xl font-bold mb-6">Severity Analytics</h2>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={severityData}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Prediction History */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-blue-700">
          🩺 Prediction History
        </h2>

        <div className="space-y-6">
          {history.length === 0 ? (
            <p className="text-gray-500 text-lg">
              No prediction history found.
            </p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className={
                  item.severity === "Critical"
                    ? "bg-red-100 border-l-8 border-red-600 p-6 rounded-2xl shadow"
                    : item.severity === "High"
                      ? "bg-orange-100 border-l-8 border-orange-500 p-6 rounded-2xl shadow"
                      : item.severity === "Medium"
                        ? "bg-yellow-100 border-l-8 border-yellow-500 p-6 rounded-2xl shadow"
                        : "bg-green-100 border-l-8 border-green-500 p-6 rounded-2xl shadow"
                }
              >
                <h3 className="text-2xl font-bold mb-3">🦠 {item.disease}</h3>

                <p className="mb-2 text-lg">
                  <strong>Symptoms:</strong> {item.symptoms.join(", ")}
                </p>

                <p className="text-lg">
                  <strong>Severity:</strong> {item.severity}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
