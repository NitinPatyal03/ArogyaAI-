import { Link } from "react-router-dom";

function QuickServices() {
  const services = [
    {
      title: "Disease Prediction",
      subtitle: "Predict Disease",
      icon: "🩺",
      color: "from-blue-500 to-blue-700",
      route: "/prediction",
    },

    {
      title: "Appointment",
      subtitle: "Book Doctor",
      icon: "📅",
      color: "from-green-500 to-green-700",
      route: "/appointment",
    },

    {
      title: "Medical History",
      subtitle: "View Reports",
      icon: "📋",
      color: "from-indigo-500 to-indigo-700",
      route: "/history",
    },

    {
      title: "Health Monitor",
      subtitle: "Track Health",
      icon: "❤️",
      color: "from-cyan-500 to-cyan-700",
      route: "/health-monitor",
    },

    {
      title: "Medicine Reminder",
      subtitle: "Daily Reminder",
      icon: "💊",
      color: "from-purple-500 to-purple-700",
      route: "/medicine-reminder",
    },

    {
      title: "Emergency SOS",
      subtitle: "Emergency Help",
      icon: "🚨",
      color: "from-red-500 to-red-700",
      route: "/sos",
    },
  ];

  return (
    <div
      className="
      max-w-7xl
      mx-auto
      px-6
      mt-10
      "
    >
      <h2
        className="
        text-3xl
        font-bold
        text-gray-700
        mb-8
        "
      >
        Quick Services
      </h2>

      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-8
        "
      >
        {services.map((service) => (
          <Link
            key={service.title}
            to={service.route}
            className={`
    group
    relative
    overflow-hidden
    bg-gradient-to-r
    ${service.color}
    rounded-3xl
    p-8
    text-white
    shadow-xl
    hover:shadow-2xl
    hover:-translate-y-2
    hover:scale-105
    transition-all
    duration-300
  `}
          >
            {/* Background Circle */}

            <div
              className="
    absolute
    -right-8
    -top-8
    w-32
    h-32
    rounded-full
    bg-white/10
    group-hover:scale-150
    transition-all
    duration-500
    "
            />

            {/* Icon */}

            <div className="relative text-6xl mb-6">{service.icon}</div>

            {/* Title */}

            <h3 className="relative text-2xl font-bold">{service.title}</h3>

            <p className="relative mt-2 opacity-90">{service.subtitle}</p>

            {/* Button */}

            <div
              className="
    relative
    mt-6
    flex
    justify-between
    items-center
    "
            >
              <span className="text-sm">Open Service</span>

              <div
                className="
      w-10
      h-10
      rounded-full
      bg-white/20
      flex
      items-center
      justify-center
      group-hover:translate-x-2
      transition
      "
              >
                →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuickServices;
