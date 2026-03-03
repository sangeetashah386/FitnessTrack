// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api"; // your axios api
import { setCredentials } from "../store/authSlice";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Build payload
      const payload = {
        email,
        firstName: firstName || "User",
        lastName,
        keycloakId: localStorage.getItem("keycloakId"), // from OAuth login if any
      };

      const response = await registerUser(payload);

      // Save userId in Redux
      //dispatch(setCredentials({ userId: response.data.id }));

      // Redirect to dashboard or home page
      navigate("/dashboard");

    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
      <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;