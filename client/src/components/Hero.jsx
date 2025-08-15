// src/components/Hero.jsx
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="relative w-full h-[80vh] md:h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/land-vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 bg-black/40">
        <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
          <Typewriter
            words={[
              "Satisfy your cravings",
              "Fast. Fresh. Delivered.",
              "Welcome to GrubQuest!",
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h1>

        <p className="text-orange-100 mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-md sm:max-w-xl">
          Explore delicious meals from your favorite restaurants delivered
          straight to your door.
        </p>

        <Link to="/home">
          <Button className="mt-5 sm:mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 text-sm sm:text-base rounded-lg">
            Explore Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
