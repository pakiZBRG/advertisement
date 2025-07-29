import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <main className="flex flex-col h-screen">
      <Header />

      <section className="bg-gray-900 text-amber-50 flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Create Advertisement for Your Goods
        </h2>
        <p className="opacity-80">Sell anything at any time and price</p>
        <button className="px-5 py-1 mt-8 text-xl rounded-lg cursor-pointer font-semibold bg-yellow-400 text-gray-900">
          Create your ad <span className="ml-1">➜</span>
        </button>
      </section>

      <Footer />
    </main>
  );
};

export default Home;
