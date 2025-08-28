import React, { useState } from "react";
import { PhoneInput } from "react-international-phone";
import { toast } from "sonner";
import api from "../api/axios";
import useUserStore from "../context/UserContext";

const CHAR_LIMITS = {
  small: 200,
  medium: 300,
  big: 400,
};

const RADIO_BUTTONS = ["small", "medium", "big"];

// Doesn't re-render heavy PhoneInput component on description keystroke
const PhoneField = React.memo(({ phone, setPhone }) => (
  <PhoneInput
    inputClassName="w-72"
    defaultCountry="rs"
    value={phone}
    onChange={setPhone}
  />
));

const AdForm = ({ type, ad, setOpenEditForm, setAds }) => {
  const [description, setDescription] = useState(
    type === "edit" ? ad.description : ""
  );
  const [phone, setPhone] = useState(type === "edit" ? ad.phoneNumber : "");
  const [selectedOption, setSelectedOption] = useState(
    type === "edit" ? ad.price : "small"
  );
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
    let fetch;

    try {
      if (description === "" || phone.length < 5) {
        toast.warning("Please enter all fields");
        return 0;
      }

      const formData = {
        description,
        phoneNumber: phone,
        price: selectedOption,
        user: user.userId,
      };

      if (type === "create") {
        fetch = await api.post("/advertisements", formData);
      } else if (type === "edit") {
        fetch = await api.put(`/advertisements/${ad._id}`, formData);
      }

      toast.success(fetch.data.message);

      if (type === "create") {
        setDescription("");
        setPhone("");
        setSelectedOption("small");
      } else if (type === "edit") {
        setAds((prevAds) =>
          prevAds.map((ad) =>
            ad._id === fetch.data.ad._id ? fetch.data.ad : ad
          )
        );
        setOpenEditForm(false);
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-6 flex flex-col w-80 ${
        type === "edit" ? "text-[#e8e8e8]" : null
      }`}
    >
      <label htmlFor="option" className="text-sm">
        Price option
      </label>
      <div className="flex justify-between">
        {RADIO_BUTTONS.map((btn, i) => (
          <label key={i} className="flex justify-center items-center">
            <input
              type="radio"
              name="price"
              value={btn}
              className="mr-1"
              checked={selectedOption === btn}
              onChange={handleOption}
            />
            {btn.charAt(0).toUpperCase() + btn.slice(1)}
          </label>
        ))}
      </div>
      <label htmlFor="description" className="text-sm mt-3">
        Description
      </label>
      <textarea
        rows={5}
        maxLength={limit}
        className="resize-none input"
        name="description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <div className="text-right text-sm mt-1">
        {description.length}/{limit}
      </div>

      <label htmlFor="phone" className="text-sm mt-1">
        Phone number
      </label>
      <PhoneField phone={phone} setPhone={setPhone} />
      <button className="mt-8 button" type="submit">
        {type === "edit" ? "Edit" : "Create"}
      </button>
    </form>
  );
};

export default AdForm;
