import React from "react";

const About = () => {
  return (
    <section className="bg-orange-50 py-12 px-4 sm:px-6 lg:px-8 rounded-2xl mx-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">About GrubQuest</h2>
        <p className="text-lg text-gray-600 mb-6">
          At <span className="font-semibold text-orange-600">GrubQuest</span>, we're redefining the way India eats. Whether you're craving local street flavors or gourmet delights, our platform connects you with top restaurants across cities — fast, fresh, and delivered to your doorstep.
        </p>
        <p className="text-gray-700 text-base">
          Founded with the vision to make food delivery seamless, GrubQuest is more than just a food app — it’s your personal culinary companion. With an easy-to-use interface, curated food collections, and real-time order tracking, your next favorite meal is just a few clicks away.
        </p>
      </div>
    </section>
  );
};

export default About;
