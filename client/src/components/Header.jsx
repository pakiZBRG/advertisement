import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-950 text-amber-50">
      <ul className="flex justify-between items-center mx-2 p-4">
        <div className="flex flex-row">
          <li className="mr-4">Home</li>
          <li className="mr-4">About</li>
          <li>Contact</li>
        </div>
        <li className="px-3 py-1 text-xl rounded-lg cursor-pointer font-semibold bg-yellow-400 text-gray-900">
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
