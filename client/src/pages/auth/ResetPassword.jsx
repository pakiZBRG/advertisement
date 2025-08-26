import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Divider from "../../components/Divider";
import { Link, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password === "" || formData.confrimPassword === "") {
        toast.warning("Please enter both fields");
        return 0;
      }
      if (formData.password === formData.confrimPassword) {
        toast.warning("Passwords do not match");
        return 0;
      }

      const { data } = await axios.post(
        `/api/v1/auth/reset-password/${token}`,
        formData
      );
      setFormData({});
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      <Header />

      <section className="background flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Reset Password
        </h2>
        <p className="opacity-80">Set your new password and confirm it.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col w-72">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            className="input"
            type="password"
            name="password"
            id="password"
            value={formData.password}
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
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button className="mt-8 button" type="submit">
            Set Password
          </button>
          <Divider />
          <Link className="button" to="/login">
            Login
          </Link>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default ResetPassword;
