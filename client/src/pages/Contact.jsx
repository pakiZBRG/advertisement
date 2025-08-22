import { useState } from "react";
import { toast } from "sonner";
import { FaPaperPlane } from "react-icons/fa6";

import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/users/send-message", formData);
      setFormData({ email: "", name: "", message: "" });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      <Header />

      <section className="bg-gray-900 text-amber-50 flex-1 flex justify-center flex-col items-center">
        <h2 className="text-2xl font-bold">Found any inconvenience?</h2>
        <p className="mt-1 mb-2 opacity-80">
          Contact us at any time with any thing
        </p>

        <form onSubmit={sendMessage} className="mt-6 flex flex-col w-80">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            required
            className="text-gray-900 bg-amber-50 rounded-lg p-1 px-2 outline-0"
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="name" className="text-sm mt-3">
            Name
          </label>
          <input
            required
            className="text-gray-900 bg-amber-50 rounded-lg p-1 px-2 outline-0"
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="message" className="text-sm mt-3">
            Message
          </label>
          <textarea
            rows={5}
            required
            className="text-gray-900 resize-none bg-amber-50 rounded-lg p-1 px-2 outline-0"
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button
            className="mt-6 bg-yellow-400 py-1 rounded-lg cursor-pointer font-bold text-md flex justify-center items-center text-gray-950"
            type="submit"
          >
            Send message
            <FaPaperPlane className="ml-2" />
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
