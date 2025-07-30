import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

import Header from "../components/Header";
import Footer from "../components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/users/forgot-password", {
        email,
      });
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
          Frogot Password?
        </h2>
        <p>We will send an email so you can reset it.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col w-72">
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
          <button
            className="mt-8 bg-yellow-400 py-1 rounded-lg cursor-pointer font-bold text-lg text-gray-950"
            type="submit"
          >
            Send Email
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default ForgotPassword;
