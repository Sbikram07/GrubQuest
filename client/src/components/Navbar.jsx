// src/components/Navbar.jsx

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import JoinUsPopup from "./JoinUsPopup";




const Navbar = () => {
  const [joinOpen, setJoinOpen] = useState(false);


  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white/ backdrop-blur-md shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-y-4 sm:gap-y-0">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3 justify-center">
            <img
              src="/logo.png"
              alt="logo"
              className="w-11 h-11 object-cover rounded-lg"
    
            />
            <Link
              to="/"
              className="text-2xl font-bold tracking-wide text-orange-600"
            >
              GrubQuest
            </Link>
          </div>

          {/* Right: Nav Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <Link to="/home">
              <Button
                variant="ghost"
                className="text-orange-500 hover:text-orange-900 hover:bg-orange-100/60 transition-all duration-200 font-bold"
              >
                Explore
              </Button>
            </Link>

            <Button
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-100 transition"
              onClick={() => setJoinOpen(true)}
            >
              Join Us
            </Button>

            <Link to="/login">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white transition">
                Login
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <JoinUsPopup open={joinOpen} setOpen={setJoinOpen} />
    </>
  );
};

export default Navbar;
