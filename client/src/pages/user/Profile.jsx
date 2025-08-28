import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import dayjs from "dayjs";
import { FaPhone, FaMoneyBill1Wave, FaCalendarWeek } from "react-icons/fa6";
import InfiniteScroll from "react-infinite-scroll-component";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useUserStore from "../../context/UserContext";
import api from "../../api/axios";

const Profile = () => {
  const [ads, setAds] = useState([]);
  const [profile, setProfile] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [last, setLast] = useState("");
  const { user } = useUserStore();

  const getUserAds = async () => {
    try {
      const { data } = await api.get(`/users/user-ads/${user.userId}`, {
        params: { last },
      });
      const newAds = data.advertisements;
      setAds((prev) => [...prev, ...newAds]);
      setProfile(data.user);

      if (newAds.length > 0) {
        setLast(newAds[newAds.length - 1]._id);
      } else {
        setHasMore(false);
      }
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

      <section className="background py-12 flex-1 flex justify-center flex-col items-center">
        <h2 className="text-3xl font-bold text-center mb-3">
          Hello, {profile.username}
        </h2>
        <p className="mb-10 text-center">
          You currently have <b>{ads.length}</b> advertisements at your disposal
        </p>
        <div className="w-[90%] mx-auto">
          <InfiniteScroll
            dataLength={ads.length}
            next={getUserAds}
            hasMore={hasMore}
            loader={<h4 className="text-center mt-4">Loading...</h4>}
            endMessage={
              <p className="text-center mt-4 text-sm italic animate-pulse">
                <b>You have reached the end.</b>
              </p>
            }
          >
            <ul className="flex flex-wrap justify-center">
              {ads?.map((ad) => (
                <li
                  key={ad._id}
                  className="min-h-24 border-[1px] border-gray-700 rounded-xl w-68 bg-[#1d1c21] p-4 m-2 flex flex-col justify-between cursor-default hover:-translate-y-1 transition duration-200"
                >
                  <p className="break-words text-gray-300">{ad.description}</p>
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
          </InfiniteScroll>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Profile;
