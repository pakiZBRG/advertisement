import { Navigate } from "react-router-dom";
import React from "react";
import "react-international-phone/style.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useUserStore from "../../context/UserContext";
import AdForm from "../../components/AdForm";

const CreateAdvertisement = () => {
  const { user } = useUserStore();

  return (
    <main className="flex flex-col h-screen">
      {user.userId ? null : <Navigate to="/" />}
      <Header />

      <section className="background flex-1 flex justify-center flex-col items-center">
        <h2 className="text-3xl text-center mx-3 mb-3 font-bold">
          Create Advertisement for Your Goods
        </h2>
        <AdForm type="create" />
      </section>

      <Footer />
    </main>
  );
};

export default CreateAdvertisement;
