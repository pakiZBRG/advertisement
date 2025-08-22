import { useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { FaUserPlus } from "react-icons/fa6";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import useUserStore from "../context/UserContext.jsx";

const Register = () => {
  const { user } = useUserStore();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/users", formData);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      {user?.length ? <Navigate to="/" /> : null}
      <Header />

      <section className="background flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Create a new account
        </h2>
        <p className="opacity-80">
          Already have an account?{" "}
          <Link className="underline" to="/login">
            Log in
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col w-80">
          <label htmlFor="username" className="text-sm">
            Username
          </label>
          <input
            className="input"
            type="username"
            name="username"
            id="username"
            onChange={handleChange}
          />
          <label htmlFor="email" className="text-sm mt-4">
            Email
          </label>
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
          />
          <label htmlFor="password" className="text-sm mt-4">
            Password
          </label>
          <input
            className="input"
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword" className="text-sm mt-4">
            Confirm password
          </label>
          <input
            className="input"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleChange}
          />
          <button className="mt-8 button" type="submit">
            Create Account
            <FaUserPlus className="ml-2" />
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Register;
