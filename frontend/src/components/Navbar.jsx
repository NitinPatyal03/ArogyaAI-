import { Link } from "react-router-dom";

function Navbar() {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const profileImage = localStorage.getItem("profileImage");

  const userName = localStorage.getItem("name");
  return (
    <nav
      className="
      bg-white
      shadow-md
      px-8
      py-4
      flex
      justify-between
      items-center
      "
    >
      <h1
        className="
        text-3xl
        font-bold
        text-blue-600
        "
      >
        🩺 ArogyaAI
      </h1>

      <div className="flex gap-6">
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="
      bg-blue-600
      text-white
      px-5
      py-2
      rounded-xl
      hover:bg-blue-700
      "
          >
            Home
          </Link>

          <Link
            to="/appointment"
            className="
      bg-blue-600
      text-white
      px-5
      py-2
      rounded-xl
      hover:bg-blue-700
      "
          >
            Appointment
          </Link>

          <Link
            to="/history"
            className="
      bg-blue-600
      text-white
      px-5
      py-2
      rounded-xl
      hover:bg-blue-700
      "
          >
            History
          </Link>

          {role === "admin" && (
            <Link
              to="/admin"
              className="
      bg-red-600
      text-white
      px-5
      py-2
      rounded-xl
      hover:bg-red-700
      "
            >
              👨‍⚕️ Admin
            </Link>
          )}
        </div>
      </div>

      <div
        className="
        flex
        items-center
        gap-3
        "
      >
        <Link
          to="/profile"
          className="
  flex
  items-center
  gap-3
  hover:bg-green-100
  px-3
  py-2
  rounded-full
  transition-all
  "
        >
          <img
            src={
              profileImage
                ? `https://arogyaai-backend-dic1.onrender.com/profile-image/${profileImage}`
                : `https://ui-avatars.com/api/?name=${userName}`
            }
            alt="Profile"
            className="
    w-11
    h-11
    rounded-full
    object-cover
    border-2
    border-blue-600
    "
          />

          <span className="font-semibold text-gray-700 hidden md:block">
            {userName}
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
