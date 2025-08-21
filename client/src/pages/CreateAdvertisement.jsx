import { Navigate } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "sonner";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import Header from "../components/Header";
import Footer from "../components/Footer";
import useUserStore from "../context/UserContext";
import api from "../api/axios";

const CHAR_LIMITS = {
  small: 200,
  medium: 300,
  big: 400,
};

// Doesn't re-render heavy PhoneInput component on description keystroke
const PhoneField = React.memo(({ phone, setPhone }) => (
  <PhoneInput
    inputClassName="w-72"
    defaultCountry="rs"
    value={phone}
    onChange={setPhone}
  />
));

const CreateAdvertisement = () => {
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedOption, setSelectedOption] = useState("small");
  const { user } = useUserStore();

  const limit = CHAR_LIMITS[selectedOption];

  const handleOption = (e) => {
    const newOption = e.target.value;
    setSelectedOption(newOption);

    const newLimit = CHAR_LIMITS[newOption];

    if (description.length > newLimit) {
      setDescription(description.slice(0, newLimit));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        description,
        phoneNumber: phone,
        price: selectedOption,
        user: user.userId,
      };

      const { data } = await api.post("/advertisements", formData);
      toast.success(data.message);
      setDescription("");
      setPhone("");
      setSelectedOption("small");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      {user.userId ? null : <Navigate to="/" />}
      <Header />

      <section className="bg-gray-900 text-amber-50 flex-1 flex justify-center flex-col items-center">
        <h2 className="text-3xl text-center mx-3 mb-3 font-bold">
          Create Advertisement for Your Goods
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col w-80">
          <label htmlFor="option" className="text-sm">
            Price option
          </label>
          <div className="flex justify-between">
            <label>
              <input
                type="radio"
                name="price"
                value="small"
                className="mr-1"
                checked={selectedOption === "small"}
                onChange={handleOption}
              />
              Small
            </label>

            <label>
              <input
                type="radio"
                name="price"
                value="medium"
                className="mr-1"
                checked={selectedOption === "medium"}
                onChange={handleOption}
              />
              Medium
            </label>

            <label>
              <input
                type="radio"
                name="price"
                value="big"
                className="mr-1"
                checked={selectedOption === "big"}
                onChange={handleOption}
              />
              Big
            </label>
          </div>
          <label htmlFor="description" className="text-sm mt-3">
            Description
          </label>
          <textarea
            rows={4}
            maxLength={limit}
            className="text-gray-900 resize-none bg-amber-50 rounded-lg p-1 px-2 outline-0"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="text-right text-sm">
            {description.length}/{limit}
          </div>

          <label htmlFor="phone" className="text-sm mt-3">
            Phone
          </label>
          <PhoneField phone={phone} setPhone={setPhone} />
          <button
            className="mt-6 bg-yellow-400 py-1 rounded-lg cursor-pointer font-bold text-md text-gray-950"
            type="submit"
          >
            Create
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
};

export default CreateAdvertisement;
