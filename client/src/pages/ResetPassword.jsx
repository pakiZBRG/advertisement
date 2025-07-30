import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

import Header from "../components/Header";
import Footer from "../components/Footer";
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
      const { data } = await axios.post(
        `/api/v1/users/reset-password/${token}`,
        formData
      );
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
          Reset Password
        </h2>
        <p>Set your new password and confirm it.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col w-72">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            className="text-gray-900 bg-amber-50 rounded-lg p-1 px-2 outline-0"
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
          />
          <label htmlFor="confirmPassword" className="text-sm mt-4">
            Confirm password
          </label>
          <input
            className="text-gray-900 bg-amber-50 rounded-lg p-1 px-2 outline-0"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleChange}
          />
          <button
            className="mt-8 bg-yellow-400 py-1 rounded-lg cursor-pointer font-bold text-lg text-gray-950"
            type="submit"
          >
            Reset
          </button>
          <div className="flex flex-row items-center">
            <span className="h-[1px] opacity-25 w-xl bg-amber-50"></span>
            <p className="p-2 my-2">or</p>
            <span className="h-[1px] opacity-25 w-xl bg-amber-50"></span>
          </div>
          <Link
            className="text-center bg-yellow-400 py-1 block rounded-lg cursor-pointer font-bold text-md text-gray-950"
            to="/login"
          >
            Login
          </Link>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default ResetPassword;
