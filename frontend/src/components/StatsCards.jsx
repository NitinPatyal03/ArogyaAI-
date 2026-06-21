import { HeartPulse, CalendarDays, Activity } from "lucide-react";
import { useEffect, useState } from "react";

function StatsCards() {
  const userName = localStorage.getItem("name") || "User";

  // Temporary values (replace with API data later)
  const healthScore = 82;
  const predictionCount = 15;
  const nextAppointment = "Today";
  const appointmentTime = "10:30 AM";
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const email = localStorage.getItem("email");

        const response = await fetch(
          `http://127.0.0.1:5000/dashboard?email=${email}`,
        );

        const data = await response.json();

        setDashboard(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  if (!dashboard) {
    return <div className="text-center py-10">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mt-10">
      {/* Greeting */}

      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome back, {dashboard.name} 👋
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Score */}

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 text-lg">Health Score</p>

              <h1 className="text-5xl font-bold mt-3">
                {dashboard.healthScore}%
              </h1>

              <p className="mt-2">Excellent Health</p>
            </div>

            <HeartPulse size={55} />
          </div>

          <div className="mt-6 w-full bg-white/30 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* Appointment */}

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-lg">Next Appointment</p>

              <h1 className="text-4xl font-bold mt-3">
                {dashboard.nextAppointment
                  ? dashboard.nextAppointment.date
                  : "No Appointment"}
              </h1>

              <p className="mt-2">
                {dashboard.nextAppointment
                  ? dashboard.nextAppointment.time
                  : ""}
              </p>
            </div>

            <CalendarDays size={55} />
          </div>
        </div>

        {/* Prediction Count */}

        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-100 text-lg">AI Predictions</p>

              <h1 className="text-5xl font-bold mt-3">
                {dashboard.predictionCount}
              </h1>

              <p className="mt-2">Total Reports</p>
            </div>

            <Activity size={55} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
