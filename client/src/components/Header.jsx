import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { FaRightFromBracket, FaRightToBracket } from "react-icons/fa6";

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
    <header className="background">
      <ul className="flex justify-between items-center mx-2 p-4">
        <div className="flex flex-row font-mono uppercase">
          <Link to="/" className="mr-4">
            Home
          </Link>
          <Link to="/contact" className="mr-4">
            Contact
          </Link>
          {user.userId ? (
            <Link to="/profile" className="mr-4">
              Profile
            </Link>
          ) : null}
        </div>
        <li className="button">
          {user.userId ? (
            <button
              className="cursor-pointer text-[1rem] flex justify-center items-center"
              onClick={logout}
            >
              Logout <FaRightFromBracket className="ml-2" />
            </button>
          ) : (
            <Link
              to="/login"
              className="text-[1rem] flex justify-around items-center"
            >
              Login <FaRightToBracket className="ml-2" />
            </Link>
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
