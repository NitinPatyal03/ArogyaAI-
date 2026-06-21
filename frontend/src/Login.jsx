import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email || !password) {
      alert("Please fill all fields");

      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);

        localStorage.setItem("phone", data.phone || "");
        localStorage.setItem("age", data.age || "");
        localStorage.setItem("bloodGroup", data.bloodGroup || "");
        localStorage.setItem("gender", data.gender || "");

        localStorage.setItem("profileImage", data.profileImage || "");

        toast.success("Login Successful ✅");

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Server Error");
    }
  };

  const login1 = () => {
    toast.success("Working");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">
          ArogyaAI 🩺
        </h1>

        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

        {/* Login Button */}
        <button
          onClick={login}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl w-full"
        >
          Login
        </button>

        {/* Signup Link */}
        <p className="text-center mt-4">
          Don't have an account?
          <a href="/signup" className="text-blue-600 ml-2">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
