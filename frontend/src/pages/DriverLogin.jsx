import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


const DriverLogin = () => {
  const [email, setEmail] = useState("dilleshnakkina@gmail.com");
  const [password, setPassword] = useState("123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const [latAndLong, setLatAndLong] = useState({ lat: 0, lon: 0 });
    const navigate = useNavigate()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatAndLong({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error.message);
        }
      );
    }
  }, []);

  const validateForm = () => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/driver/login", {
        email,
        password,
        latitude: latAndLong.lat,
        longitude: latAndLong.lon
      });

      if (res.status === 200) {
        Cookies.set("authToken", res.data.token, { expires: 7 });
        alert("Login Successful ✅");
        navigate('/driver-home');

        console.log("User:", res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-[350px] space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          🔐 Driver Login
        </h2>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
              error.includes("Email")
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
              error.includes("Password")
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Extra Links */}
        <div className="flex justify-between text-sm text-blue-500 mt-4">
          <button type="button" className="hover:underline">
            Forgot Password?
          </button>
          <button type="button" className="hover:underline">
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverLogin;
