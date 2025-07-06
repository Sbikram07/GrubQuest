import React from 'react';

const SearchBar = () => {
  return (
    <div className="w-full max-w-full mx-auto  flex items-center bg-neutral-200 p-2 rounded-xl shadow-md">
      <input
        type="text"
        placeholder="Search for dishes or restaurants..."
        className="flex-grow px-4 py-2 rounded-l-xl leading-3 outline-none text-gray-800"
      />
      <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-r-xl transition ">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
