import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SignUpPage = () => {
  const [email, setEmail] = useState("dill@gmail.com");
  const [password, setPassword] = useState("123456");
  const [firstName, setFirstName] = useState("dillesh");
  const [lastName, setLastName] = useState("nakkina");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validation function
  const validateForm = () => {
    if (!firstName) return "First name is required";
    if (!lastName) return "Last name is required";
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email format";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
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
      const response = await axios.post("http://localhost:5000/add", {
        email,
        password,
        firstName,
        lastName,
      });

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        const result = response.data; // Axios already parses JSON
        Cookies.set("userToken", result.token, { expires: 7 });
        console.log("User data added successfully");
        alert("Account created successfully!");
      } else {
        console.error("Failed to add user data");
        setError("Failed to create account. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup Failed ❌");
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
          🔐 Sign Up
        </h2>

        {/* First Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
              error.includes("First name")
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ${
              error.includes("Last name")
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
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
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
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
          className="w-full !bg-yellow-400  text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
