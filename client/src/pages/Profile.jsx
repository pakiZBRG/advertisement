import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import dayjs from "dayjs";
import { FaPhone, FaMoneyBill1Wave, FaCalendarWeek } from "react-icons/fa6";

import Header from "../components/Header";
import Footer from "../components/Footer";
import useUserStore from "../context/UserContext";
import api from "../api/axios";

const Profile = () => {
  const [ads, setAds] = useState([]);
  const [profile, setProfile] = useState({});
  const { user } = useUserStore();

  const getUserAds = async () => {
    try {
      const { data } = await api.get(`/users/user-ads/${user.userId}`);
      setAds(data.advertisements);
      setProfile(data.user);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  useEffect(() => {
    if (user.userId) getUserAds();
  }, [user.userId]);

  return (
    <main className="flex flex-col h-screen">
      {user.userId ? null : <Navigate to="/" />}
      <Header />

      <section className="bg-gray-900 text-amber-50 py-12 flex-1 flex justify-center flex-col items-center">
        <h2 className="text-2xl font-bold">Hello, {profile.username}</h2>
        <p className="mb-10 text-center">
          You currently have <b>{ads.length}</b> advertisements at your disposal
        </p>
        <div className="w-[90%] mx-auto">
          <ul className="flex flex-wrap justify-center">
            {ads?.map((ad) => (
              <li
                key={ad._id}
                className="border-1 min-h-24 rounded-sm w-68 border-white p-2 m-2 flex flex-col justify-between cursor-default hover:-translate-y-1 hover:translate-x-1 transition duration-200"
              >
                <p className="break-words">{ad.description}</p>
                <div>
                  <small className="mt-2 flex justify-between w-full">
                    <span className="flex items-center">
                      <FaPhone className="mr-1" />
                      {ad.phoneNumber}
                    </span>
                    <span className="flex items-center">
                      <FaMoneyBill1Wave className="mr-1" />
                      {ad.price}
                    </span>
                  </small>
                  <small className="flex items-center">
                    <FaCalendarWeek className="mr-1" />
                    {dayjs(ad.createdAt).format("MMMM D YYYY, HH:mm")}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Profile;
