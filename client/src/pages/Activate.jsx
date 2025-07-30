import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";

const Activate = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const activateUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/v1/users/activate/${token}`);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      <Header />

      <section className="bg-gray-900 text-amber-50 flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Activate your account
        </h2>
        <div className="w-80">
          <button
            className="text-center bg-yellow-400 w-full mt-7 py-1 rounded-lg cursor-pointer font-bold text-md text-gray-950"
            onClick={activateUser}
          >
            Activate
          </button>
          <div className="flex flex-row items-center">
            <span className="h-[1px] opacity-25 w-xl bg-amber-50"></span>
            <p className="p-2 my-2">or</p>
            <span className="h-[1px] opacity-25 w-xl bg-amber-50"></span>
          </div>
          <Link
            className="text-center bg-yellow-400 py-1 block rounded-lg cursor-pointer font-bold text-md text-gray-950"
            to="/login"
          >
            Login
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Activate;
