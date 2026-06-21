import { useState } from "react";
import GoogleFitLogin from "./GoogleFitLogin";
import toast from "react-hot-toast";

function HealthMonitor() {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState({
    heartRate: 82,
    steps: 6543,
    calories: 52,
    sleep: 7.2,
  });

  const saveHealth = async () => {
    await fetch(
      "https://arogyaai-backend-wudu.onrender.com/save-health",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(healthData),
      },
    );

    toast.success("Health Data Saved");
  };

  const googleToken = localStorage.getItem("google_access_token");

  const calculateHealthScore = () => {
    let score = 100;

    if (healthData.heartRate > 120) score -= 25;

    if (healthData.sleep < 6) score -= 20;

    if (healthData.steps < 3000) score -= 15;

    return score;
  };

  const healthScore = calculateHealthScore();

  const connectGoogleFit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("google_access_token");

      const response = await fetch("https://arogyaai-backend-wudu.onrender.com/google-fit-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });

      const data = await response.json();

      console.log(data);

      setHealthData({
        heartRate: data.heartRate || 82,

        steps: data.steps || 3286,

        calories: data.calories || 28,

        sleep: data.sleep || 5.3,
      });

      toast.success("Wearable Data Synced Successfully");
    } catch (error) {
      console.log(error);

      toast.error("Failed to sync wearable data");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-cyan-700">⌚ Health Monitor</h1>

        <a
          href="/"
          className="
      bg-white
      text-blue-700
      px-6
      py-3
      rounded-2xl
      font-bold
      shadow-lg
      hover:bg-gray-100
      "
        >
          🏠 Back Home
        </a>
      </div>

      {/* Google Fit Connection */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">Google Fit Integration</h2>

        <p className="text-gray-600 mb-4">
          Connect your Google Fit account to monitor activity, heart rate and
          sleep data.
        </p>

        {googleToken ? (
          <div>
            <p className="text-green-600 font-bold mb-4">
              ✅ Google Fit Connected
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={connectGoogleFit}
                disabled={loading}
                className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-5
            py-3
            rounded-2xl
            shadow-lg
            "
              >
                {loading ? "Syncing..." : "🔄 Sync Wearable Data"}
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("google_access_token");

                  window.location.reload();
                }}
                className="
            bg-red-600
            hover:bg-red-700
            text-white
            px-5
            py-3
            rounded-2xl
            shadow-lg
            "
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-red-600 font-bold mb-4">
              ❌ Google Fit Not Connected
            </p>

            <GoogleFitLogin />
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-8 rounded-3xl shadow-2xl mb-8">
        <h2 className="text-2xl font-bold">Health Score</h2>

        <p className="text-6xl font-bold mt-4">{healthScore}/100</p>
      </div>

      <div className="space-y-3 mb-8">
        {healthData.heartRate > 120 && (
          <div className="bg-red-500 text-white p-4 rounded-xl">
            🚨 High Heart Rate Detected
          </div>
        )}

        {healthData.sleep < 6 && (
          <div className="bg-yellow-500 text-white p-4 rounded-xl">
            ⚠ Sleep Deficiency Detected
          </div>
        )}

        {healthData.steps < 3000 && (
          <div className="bg-orange-500 text-white p-4 rounded-xl">
            ⚠ Low Physical Activity
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold">❤️ Heart Rate</h2>
          <p className="text-4xl mt-4">{healthData.heartRate} BPM</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold">👣 Steps</h2>
          <p className="text-4xl mt-4">{healthData.steps}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold">🔥 Calories</h2>
          <p className="text-4xl mt-4">{healthData.calories}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold">😴 Sleep</h2>
          <p className="text-4xl mt-4">{healthData.sleep} hrs</p>
        </div>
      </div>

      <button
        onClick={saveHealth}
        className=" bg-green-600 text-white  px-6  py-3  rounded-2xl  mt-8  "
      >
        Save Health Data
      </button>

      <div className="bg-white p-8 rounded-3xl shadow-xl mt-8">
        <h2 className="text-3xl font-bold mb-4">AI Recommendations</h2>

        <ul className="space-y-2">
          {healthData.sleep < 6 && <li>😴 Increase sleep to 7-8 hours.</li>}

          {healthData.steps < 3000 && (
            <li>🚶 Walk at least 6000 steps daily.</li>
          )}

          {healthData.heartRate > 120 && (
            <li>❤️ Consult a doctor if elevated heart rate persists.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default HealthMonitor;
