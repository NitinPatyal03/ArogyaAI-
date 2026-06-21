import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Droplets,
  Calendar,
  Shield,
  Pencil,
  Save,
  LogOut,
  X,
  ArrowLeft,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "",

    email: localStorage.getItem("email") || "",

    phone: localStorage.getItem("phone") || "",

    age: localStorage.getItem("age") || "22",

    bloodGroup: localStorage.getItem("bloodGroup") || "B+",

    gender: localStorage.getItem("gender") || "Male",
  });
  const imageName = localStorage.getItem("profileImage");

  const [profileImage, setProfileImage] = useState(
    imageName
      ? `http://127.0.0.1:5000/profile-image/${imageName}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          localStorage.getItem("name") || "User",
        )}&background=2563eb&color=fff`,
  );

  const handleChange = (e) => {
    setUser({
      ...user,

      [e.target.name]: e.target.value,
    });
  };
  const uploadProfileImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    formData.append(
      "email",

      localStorage.getItem("email"),
    );

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/upload-profile-image",

        {
          method: "POST",

          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("profileImage", data.image);

        setProfileImage(
          `http://127.0.0.1:5000/profile-image/${data.image}?t=${Date.now()}`,
        );

        toast.success("Profile Picture Updated");
      }
    } catch {
      toast.error("Upload Failed");
    }
  };
  const saveProfile = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/update-profile",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(user),
        },
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("name", user.name);

        localStorage.setItem("phone", user.phone);

        localStorage.setItem("age", user.age);

        localStorage.setItem("bloodGroup", user.bloodGroup);

        localStorage.setItem("gender", user.gender);

        toast.success("Profile Updated Successfully");

        setEditMode(false);
      } else {
        toast.error("Profile Update Failed");
      }
    } catch (err) {
      console.log(err);

      toast.error("Server Error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}

          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white rounded-t-3xl">
            {/* Top Buttons */}

            <div className="absolute top-5 right-5">
              <button
                onClick={() => navigate("/")}
                className="
      flex
      items-center
      gap-2
      bg-white/20
      backdrop-blur-md
      px-4
      py-2
      rounded-xl
      hover:bg-white/30
      transition-all
      duration-300
      "
              >
                🏠 Back Home
              </button>
            </div>

            {/* Profile Section */}

            <div className="flex flex-col items-center pt-16 pb-10 px-6">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="
        w-40
        h-40
        rounded-full
        object-cover
        border-4
        border-white
        shadow-2xl
        "
                />

                <label
                  className="
        absolute
        bottom-2
        right-2
        w-12
        h-12
        rounded-full
        bg-white
        text-blue-700
        flex
        items-center
        justify-center
        shadow-lg
        cursor-pointer
        hover:bg-gray-100
        transition-all
        "
                >
                  <Camera size={20} />

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={uploadProfileImage}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <h1 className="text-4xl font-bold">{user.name}</h1>

                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Verified
                </span>
              </div>

              <p className="text-blue-100 mt-2">AI Healthcare User</p>

              <p className="text-blue-200">{user.email}</p>
            </div>
          </div>

          {/* Profile Details */}

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <InfoInput
                icon={<User size={20} />}
                title="Full Name"
                name="name"
                value={user.name}
                onChange={handleChange}
                disabled={!editMode}
              />

              <InfoInput
                icon={<Mail size={20} />}
                title="Email"
                name="email"
                value={user.email}
                disabled={true}
              />

              <InfoInput
                icon={<Phone size={20} />}
                title="Phone"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                disabled={!editMode}
              />

              <InfoInput
                icon={<Calendar size={20} />}
                title="Age"
                name="age"
                value={user.age}
                onChange={handleChange}
                disabled={!editMode}
              />
              <InfoInput
                icon={<Droplets size={20} />}
                title="Blood Group"
                name="bloodGroup"
                value={user.bloodGroup}
                onChange={handleChange}
                disabled={!editMode}
              />

              <InfoInput
                icon={<Shield size={20} />}
                title="Gender"
                name="gender"
                value={user.gender}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>

            {/* Buttons */}

            <div className="flex flex-wrap gap-4 mt-10">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="
                  flex
                  items-center
                  gap-2
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-8
                  py-3
                  rounded-xl
                  transition
                  "
                >
                  <Pencil size={20} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={saveProfile}
                    className="
                    flex
                    items-center
                    gap-2
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-8
                    py-3
                    rounded-xl
                    transition
                    "
                  >
                    <Save size={20} />
                    Save Changes
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="
                    flex
                    items-center
                    gap-2
                    bg-gray-500
                    hover:bg-gray-600
                    text-white
                    px-8
                    py-3
                    rounded-xl
                    transition
                    "
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </>
              )}

              <button
                onClick={logout}
                className="
                flex
                items-center
                gap-2
                bg-red-600
                hover:bg-red-700
                text-white
                px-8
                py-3
                rounded-xl
                ml-auto
                transition
                "
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Input ---------- */

function InfoInput({
  icon,

  title,

  name,

  value,

  onChange,

  disabled,
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <label className="flex items-center gap-2 text-gray-600 font-semibold mb-2">
        {icon}

        {title}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="
        w-full
        border
        rounded-xl
        p-3
        focus:ring-2
        focus:ring-blue-500
        outline-none
        disabled:bg-gray-200
        disabled:cursor-not-allowed
        "
      />
    </div>
  );
}

export default Profile;
