import { Link } from "react-router-dom";
import useUserStore from "../context/UserContext";

const Footer = () => {
  const { user } = useUserStore();

  return (
    <footer className="bg-gray-950 text-amber-50">
      <ul className="flex justify-center mx-2 p-4">
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
      </ul>
    </footer>
  );
};

export default Footer;
