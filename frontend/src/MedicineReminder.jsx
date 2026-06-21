import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function MedicineReminder() {
  const [medicine, setMedicine] = useState("");

  const [time, setTime] = useState("");

  const [email, setEmail] = useState("");

  const [reminders, setReminders] = useState([]);

  // -----------------------------------
  // Load Saved Reminders
  // -----------------------------------
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("reminders")) || [];

    setReminders(saved);
  }, []);

  // -----------------------------------
  // Reminder Notification System
  // -----------------------------------
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();

      const currentTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      reminders.forEach((reminder) => {
        if (reminder.time === currentTime) {
          // Notification
          if (Notification.permission === "granted") {
            new Notification(
              "💊 Medicine Reminder",

              {
                body: `Time to take ${reminder.medicine}`,
              },
            );
          }

          // Alarm Sound
          const audio = new Audio("/alert.mp3");

          audio.play();

          // Email API
          fetch(
            "http://127.0.0.1:5000/send-medicine-email",

            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                medicine: reminder.medicine,

                email: reminder.email,
              }),
            },
          );
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  // -----------------------------------
  // Add Reminder
  // -----------------------------------
  const addReminder = () => {
    if (!medicine || !email || !time) {
      toast.error("Please fill all fields");

      return;
    }

    const newReminder = {
      id: Date.now(),

      medicine,

      email,

      time,
    };

    const updatedReminders = [...reminders, newReminder];

    setReminders(updatedReminders);

    localStorage.setItem(
      "reminders",

      JSON.stringify(updatedReminders),
    );

    setMedicine("");

    setEmail("");

    setTime("");
  };

  // -----------------------------------
  // Delete Reminder
  // -----------------------------------
  const deleteReminder = (id) => {
    const updated = reminders.filter((reminder) => reminder.id !== id);

    setReminders(updated);

    localStorage.setItem(
      "reminders",

      JSON.stringify(updated),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-8">
      {/* Top Navbar */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold text-blue-700">
            💊 Medicine Reminder
          </h1>

          <p className="text-gray-600 mt-2 text-lg">
            Smart healthcare reminder system
          </p>
        </div>

        <a
          href="/"
          className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-6
          py-3
          rounded-2xl
          shadow-xl
          transition
          "
        >
          🏠 Back Home
        </a>
      </div>

      {/* Add Reminder Card */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl mb-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Add New Reminder
        </h2>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">
          {/* Medicine */}
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="
            border-2
            border-gray-200
            focus:border-blue-500
            p-4
            rounded-2xl
            outline-none
            "
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
            border-2
            border-gray-200
            focus:border-blue-500
            p-4
            rounded-2xl
            outline-none
            "
          />

          {/* Time */}
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="
            border-2
            border-gray-200
            focus:border-blue-500
            p-4
            rounded-2xl
            outline-none
            "
          />

          {/* Button */}
          <button
            onClick={addReminder}
            className="
            bg-gradient-to-r
            from-blue-600
            to-blue-700
            hover:scale-105
            text-white
            rounded-2xl
            font-semibold
            shadow-xl
            transition
            duration-300
            "
          >
            ➕ Add Reminder
          </button>
        </div>
      </div>

      {/* Reminder List */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Active Reminders
        </h2>

        {reminders.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
            <h2 className="text-2xl text-gray-500">No reminders added yet</h2>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="
                bg-white
                rounded-3xl
                shadow-2xl
                p-6
                hover:scale-105
                transition
                duration-300
                "
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-700">
                      💊 {reminder.medicine}
                    </h2>

                    <p className="text-gray-600 mt-2">📧 {reminder.email}</p>

                    <p className="text-gray-700 mt-2 text-lg font-semibold">
                      ⏰ {reminder.time}
                    </p>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="
                  mt-4
                  w-full
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  py-3
                  rounded-2xl
                  font-semibold
                  transition
                  "
                >
                  🗑 Delete Reminder
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineReminder;
