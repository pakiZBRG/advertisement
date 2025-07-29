import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-900 text-amber-50">
      <ul className="flex justify-between mx-2 p-4">
        <div className="flex flex-row">
          <li className="mr-4">Home</li>
          <li className="mr-4">About</li>
          <li>Contact</li>
        </div>
        <li>Login</li>
      </ul>
    </header>
  );
};

export default Header;
