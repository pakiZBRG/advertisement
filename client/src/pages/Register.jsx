import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const Register = () => {
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
      <Header />

      <section className="bg-gray-900 text-amber-50 flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Create a new account
        </h2>
        <p>
          Already have an account?{" "}
          <Link className="text-amber-400 underline" to="/login">
            Log in
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col w-80">
          <label htmlFor="username" className="text-sm">
            Username
          </label>
          <input
            className="text-gray-900 bg-amber-50 rounded-lg p-1 px-2 outline-0"
            type="username"
            name="username"
            id="username"
            onChange={handleChange}
          />
          <label htmlFor="email" className="text-sm mt-4">
            Email
          </label>
          <input
            className="text-gray-900 bg-amber-50 rounded-lg p-1 px-2 outline-0"
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
          />
          <label htmlFor="password" className="text-sm mt-4">
            Password
          </label>
          <input
            className="bg-amber-50 text-gray-900 rounded-lg p-1 px-2 outline-0"
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword" className="text-sm mt-4">
            Confirm password
          </label>
          <input
            className="bg-amber-50 text-gray-900 rounded-lg p-1 px-2 outline-0"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleChange}
          />
          <button
            className="mt-8 bg-yellow-400 py-1 rounded-lg cursor-pointer font-bold text-md text-gray-950"
            type="submit"
          >
            Create Account
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Register;
