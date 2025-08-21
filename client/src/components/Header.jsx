import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import useUserStore from "../context/UserContext";

const Header = () => {
  const { user, clearUser } = useUserStore();

  const logout = async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/users/logout",
        { user },
        {
          withCredentials: true,
        }
      );
      clearUser();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <header className="bg-gray-950 text-amber-50">
      <ul className="flex justify-between items-center mx-2 p-4">
        <div className="flex flex-row">
          <Link to="/" className="mr-4">
            Home
          </Link>
          <li className="mr-4">About</li>
          <li>Contact</li>
        </div>
        <li className="px-3 py-1 text-xl rounded-lg cursor-pointer font-semibold bg-yellow-400 text-gray-900">
          {user.userId ? (
            <button className="cursor-pointer" onClick={logout}>
              Logout
            </button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
