import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaPaperPlane } from "react-icons/fa6";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.warning("Please enter a valid email");
        return;
      }

      const { data } = await axios.post("/api/v1/users/forgot-password", {
        email,
      });
      setEmail("");
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
          Forgot Password?
        </h2>
        <p className="opacity-80">
          We will send you an email so you can reset it.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col w-72">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            className="input"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleChange}
          />
          <button className="mt-8 button" type="submit">
            Send Email
            <FaPaperPlane className="ml-2" />
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default ForgotPassword;
