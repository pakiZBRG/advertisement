import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { useAuth } from "../utils/auth";

const Header = () => {
  const { user } = useAuth();

  const logout = async () => {
    try {
      const { data } = await axios.post(
        "/api/v1/users/logout",
        { user },
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <header className="bg-gray-950 text-amber-50">
      <ul className="flex justify-between items-center mx-2 p-4">
        <div className="flex flex-row">
          <li className="mr-4">Home</li>
          <li className="mr-4">About</li>
          <li>Contact</li>
        </div>
        <li className="px-3 py-1 text-xl rounded-lg cursor-pointer font-semibold bg-yellow-400 text-gray-900">
          {user === null ? (
            <Link to="/login">Login</Link>
          ) : (
            <Link onClick={logout}>Logout</Link>
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
