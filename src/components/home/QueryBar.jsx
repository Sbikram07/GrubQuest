import React from 'react';
import SearchBar from './SearchBar';
import LocationBar from './LocationBar';

const QueryBar = () => {
  return (
    <div className="w-full px-4 py-6 flex flex-col justify-between md:flex-row gap-4 md:gap-6 items-start md:items-center">
      <LocationBar />
      <div className="w-full md:flex-1 lg:pl-10 lg:pr-4">
        <SearchBar />
      </div>
    </div>
  );
};

export default QueryBar;
