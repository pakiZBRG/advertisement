import { Link } from "react-router-dom";

import useUserStore from "../context/UserContext";

const Footer = () => {
  const { user } = useUserStore();

  return (
    <footer className="background border-t-[1px] border-gray-800">
      <ul className="flex justify-center mx-2 p-4 uppercase font-mono">
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
