import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Divider from "../../components/Divider";

const Activate = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const activateUser = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/v1/auth/activate/${token}`);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      <Header />

      <section className="background flex-1 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-center mx-3 mb-3 font-bold">
          Activate your account
        </h2>
        <p className="opacity-80">
          The token for account activation lasts for 10 minutes.
        </p>
        <div className="w-80">
          <button className="mt-8 button w-full" onClick={activateUser}>
            Activate
          </button>
          <Divider />
          <Link className="button" to="/login">
            Login
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Activate;
