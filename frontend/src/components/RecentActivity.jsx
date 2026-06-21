import { useEffect, useState } from "react";

function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivity = async () => {
      const email = localStorage.getItem("email");

      const res = await fetch(
        `https://arogyaai-backend-wudu.onrender.com/recent-activity?email=${email}`,
      );

      const data = await res.json();

      setActivities(data);
    };

    loadActivity();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6">🕒 Recent Activity</h2>

        {activities.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          activities.map((item, index) => (
            <div
              key={index}
              className="
              flex
              justify-between
              items-center
              border-b
              py-4
              hover:bg-gray-50
              rounded-xl
              px-2
              "
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{item.icon}</div>

                <div>
                  <h3 className="font-bold">{item.title}</h3>

                  <p className="text-gray-500">{item.subtitle}</p>
                </div>
              </div>

              <div className="text-gray-500">{item.date}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentActivity;
