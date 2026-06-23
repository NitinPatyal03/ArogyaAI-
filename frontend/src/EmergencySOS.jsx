import { useState } from "react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

function EmergencySOS() {
  const [location, setLocation] = useState(null);

  const [email, setEmail] = useState("");

  // -----------------------------------
  // Trigger SOS
  // -----------------------------------
  const triggerSOS = () => {
    // Get User Location
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;

      const lng = position.coords.longitude;

      setLocation({
        lat,
        lng,
      });

      // Emergency Email
      await emailjs.send(
  "service_4lem5x6",
  "template_76q5vzl",
  {
    to_email: email,
    latitude: lat,
    longitude: lng,
  },
  "f01zWD660_mrvhWsx"
);

      // Alarm Sound
      const audio = new Audio("/alert.mp3");

      audio.play();

      toast.success("🚨 Emergency SOS Sent!");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-300 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold text-red-700">🚨 Emergency SOS</h1>

          <p className="text-gray-700 mt-2 text-lg">
            Emergency healthcare assistance system
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
          shadow-lg
          "
        >
          🏠 Back Home
        </a>
      </div>

      {/* SOS Card */}
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Emergency Alert System
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Emergency Contact Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
          w-full
          border-2
          border-gray-200
          p-4
          rounded-2xl
          mb-6
          outline-none
          "
        />

        {/* SOS Button */}
        <button
          onClick={triggerSOS}
          className="
          w-full
          bg-red-600
          hover:bg-red-700
          text-white
          text-2xl
          font-bold
          py-5
          rounded-3xl
          shadow-2xl
          transition
          duration-300
          animate-pulse
          "
        >
          🚨 SEND EMERGENCY SOS
        </button>

        {/* Hospital Button */}
        {location && (
          <a
            href={`https://www.google.com/maps/search/hospitals/@${location.lat},${location.lng},15z`}
            target="_blank"
            rel="noreferrer"
            className="
            mt-6
            block
            text-center
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-4
            rounded-2xl
            "
          >
            🏥 Find Nearby Hospitals
          </a>
        )}
      </div>
    </div>
  );
}

export default EmergencySOS;
