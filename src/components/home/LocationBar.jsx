import React from 'react';
import profileImg from '../../assets/profile.jpg'; // Add your profile image in assets

const LocationBar = () => {
  return (
    <div className="w-full md:w-[40%] bg-white border border-gray-300 rounded-xl p-4 shadow-sm flex items-center  gap-4">
      <img
        src={profileImg}
        alt="Profile"
        className="h-14 w-14 rounded-full object-cover border-2 border-orange-400 shadow-sm"
      />
      <div>
        <p className="font-bold text-lg text-gray-800">Hi, Bikram 👋</p>
        <p className="text-md text-gray-600">Your current location</p>
      </div>
    </div>
  );
};

export default LocationBar;
