import { useState } from "react";
import toast from "react-hot-toast";
function Signup() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const signup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields");

      return;
    }

    try {
      const response = await fetch("https://arogyaai-backend-dic1.onrender.com/signup", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Signup Successful ✅");

        // Clear fields
        setName("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error("Server Error");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          ArogyaAI 🩺
        </h1>

        <h2 className="text-xl font-semibold text-center mb-6">
          Create Account
        </h2>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

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

        {/* Signup Button */}
        <button
          onClick={signup}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl w-full"
        >
          Signup
        </button>
        <p className="text-center mt-4">
          Already have an account?
          <a href="/login" className="text-blue-600 ml-2">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
