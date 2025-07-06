import React from "react";
import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="w-full bg-amber-500 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="GrubQuest Logo"
            className="h-16 w-auto rounded-2xl border-2 border-white shadow-md"
          />
          <h1 className="text-2xl font-bold text-white tracking-wide">
            GrubQuest
          </h1>
        </div>

        {/* Nav Links */}
        <div className="flex gap-12 sm:gap-7 md:ml-auto">
          <button className="text-white text-2xl font-medium hover:text-gray-900 transition">
            Home
          </button>
          <button className="text-white text-2xl font-medium hover:text-gray-900 transition">
            About
          </button>
          <button className="text-white text-2xl font-medium hover:text-gray-900 transition">
            Cart
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
