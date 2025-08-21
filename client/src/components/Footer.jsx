import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-amber-50">
      <ul className="flex justify-center mx-2 p-4">
        <Link to="/" className="mr-4">
          Home
        </Link>
        <Link to="/contact" className="mr-4">
          Contact
        </Link>
      </ul>
    </footer>
  );
};

export default Footer;
