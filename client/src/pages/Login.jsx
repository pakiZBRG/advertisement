import { useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import useUserStore from "../context/UserContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user, setUser } = useUserStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/users/login", formData);
      setUser({ userId: data.user, accessToken: data.accessToken });
      toast.success(data.message);
      navigate("/create");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      {user.userId ? <Navigate to="/" /> : null}
      <Header />

      <section className="bg-gray-900 text-amber-50 flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Welcome back
        </h2>
        <p>
          Don't have an account yet?{" "}
          <Link className="text-amber-400 underline" to="/register">
            Sign up
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col w-80">
          <label htmlFor="email" className="text-sm">
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
          <div className="text-right">
            <Link
              className="text-xs w-max underline mt-2 inline-block"
              to="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            className="mt-8 bg-yellow-400 py-1 rounded-lg cursor-pointer font-bold text-md text-gray-950"
            type="submit"
          >
            Login
          </button>
          <div className="flex flex-row items-center">
            <span className="h-[1px] opacity-25 w-xl bg-amber-50"></span>
            <p className="p-2 my-2">or</p>
            <span className="h-[1px] opacity-25 w-xl bg-amber-50"></span>
          </div>
          <Link
            className="text-center bg-yellow-400 py-1 rounded-lg cursor-pointer font-bold text-md text-gray-950"
            to="/register"
          >
            Login with Google
          </Link>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Login;
