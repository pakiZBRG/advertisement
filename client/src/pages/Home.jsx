import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import useUserStore from "../context/UserContext";

const Home = () => {
  const { user } = useUserStore();

  return (
    <main className="flex flex-col h-screen">
      <Header />

      <section className="background flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Create Advertisement for Your Goods
        </h2>
        <p className="opacity-80">Sell anything at any time and any price</p>
        <Link to={user.userId ? "/create" : "/login"} className="mt-8 button">
          Create your ad <span className="ml-1">➜</span>
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
