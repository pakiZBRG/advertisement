import { useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Divider from "../components/Divider.jsx";
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
      if (formData.password === "" || formData.email === "") {
        toast.warning("Please enter all fields");
        return 0;
      }

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

      <section className="background flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Welcome back
        </h2>
        <p className="opacity-80">
          Don't have an account yet?{" "}
          <Link className="underline" to="/register">
            Sign up
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col w-80">
          <label htmlFor="email" className="text-sm">
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
          <div className="text-right">
            <Link
              className="text-xs underline mt-2 inline-block"
              to="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <button className="mt-8 button" type="submit">
            Login
          </button>
          <Divider />
          <Link className="text-center button" to="/register">
            Login with Google
          </Link>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Login;
