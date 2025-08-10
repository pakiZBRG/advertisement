import { Navigate } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import useUserStore from "../context/UserContext";

const CreateAdvertisement = () => {
  const { user } = useUserStore();

  return (
    <main className="flex flex-col h-screen">
      {user?.length ? null : <Navigate to="/" />}
      <Header />

      <section className="bg-gray-900 text-amber-50 flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Create Advertisement for Your Goods
        </h2>
      </section>

      <Footer />
    </main>
  );
};

export default CreateAdvertisement;
