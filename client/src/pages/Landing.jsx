import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

import delivery from "../assets/delivey.png";


import AboutAndContact from "@/components/AboutAndContact";
import FeatureCard from "@/components/ui/FeatureCard";
import CategoryStrip from "@/components/ui/CategoryStrip";


const Landing = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <h2 className="text-3xl font-bold text-center text-slate-700  mt-3">
        Our Promise to You
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-12">
        <FeatureCard
          title="Lightning-Fast Delivery"
          description="Your favorite meals, delivered hot and fresh to your doorstep faster than you expect."
          imageUrl={delivery}
        />
        <FeatureCard
          title="Order Tracking"
          description="Stay updated with live order tracking from the kitchen to your door."
          imageUrl="/tracking.jpeg"
        />
        <FeatureCard
          title="Quality Assurence"
          description="We partner with trusted restaurants to ensure top-quality ingredients and safe preparation."
          imageUrl="/quality.png"
        />
        <FeatureCard
          title="24/7 Customer Support"
          description="Need help? Our friendly support team is here for you any time, day or night."
          imageUrl="/support.jpeg"
        />
      </div>
      <h2 className="text-3xl font-bold text-center text-slate-700 mb-5">
        Browse Your Favorites
      </h2>

      <CategoryStrip
        categories={[
          {
            name: "Pizza",
            icon: "/favourites/pizza.jpeg",
          },
          {
            name: "Burger",
            icon: "/favourites/burger.jpeg",
          },
          {
            name: "Dessert",
            icon: "/favourites/desert.jpeg",
          },
          {
            name: "Biryani",
            icon: "/favourites/briyani.jpeg",
          },
          {
            name: "Drinks",
            icon: "/favourites/drinks.jpeg",
          },
          {
            name: "Chole Bhature",
            icon: "/favourites/chole-bhature.jpeg",
          },
          {
            name: "Butter Chicken",
            icon: "/favourites/butterchicken.jpeg",
          },
          {
            name: "Chicken Tandoori",
            icon: "/favourites/tandoori.jpeg",
          },
          {
            name: "Idli Samvar",
            icon: "/favourites/idli.jpeg",
          },
          {
            name: "Dosa",
            icon: "/favourites/dosa.jpeg",
          },
          {
            name: "Fried Chicken",
            icon: "/favourites/f-chicken.jpeg",
          },
          {
            name: "Paneer Tikka",
            icon: "/favourites/paneer-tikka.jpeg",
          },
        ]}
      />

      <div>
        <AboutAndContact />
      </div>
    </>
  );
};

export default Landing;
