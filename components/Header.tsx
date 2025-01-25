'use client';

import React, { useState } from 'react';
import { RiSearch2Line } from "react-icons/ri";
import { IoHome, IoHeartSharp, IoGridSharp } from 'react-icons/io5'; // Correct imports from io5
// import { IoMdSettings } from 'react-icons/io'; // Correct import from io
import { FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function Header() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Profile image source (you can change this to your own image path)
  const profile = '/path/to/your/profile-image.jpg'; // Replace this with the actual path

  const toggleFavorite = () => {
    setIsFavorite((prevState) => !prevState);
  };

  const handleSearchChange = (e : any) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e : any) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        // Redirect to the search results page with the search query
        window.location.href = `/search?query=${searchQuery}`; // This will pass the query as a URL parameter
      }
    }
  };

  return (
    <>
      {/* Top border */}
      <div className="w-full h-[80px] border-b-2 border-slate-100 bg-white"></div>

      {/* Navbar */}
      <nav className="bg-white py-4 px-5 shadow-md flex flex-col sm:flex-row items-center justify-between fixed top-0 left-0 w-full z-10">
        {/* Logo & Search bar */}
        <div className="flex items-center justify-between sm:space-x-6 w-full sm:w-auto sm:flex-row md:flex-row lg:flex-row xl:flex-row">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">EXCELLENT</div>

          {/* Search bar */}
          <div className="relative w-full sm:w-[350px] md:w-[400px] lg:w-[492px] h-[40px] sm:h-[44px]">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyUp={handleSearch}
              placeholder="Search something here"
              className="w-full h-full border rounded-full py-2 px-4 pl-12 pr-12 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
              <RiSearch2Line />
            </div>
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={handleSearch}
            >
              <RiSearch2Line />
            </div>
          </div>
        </div>

        {/* Icon group on the right */}
        <div className="flex items-center sm:space-x-6 md:space-x-8 lg:space-x-10 xl:space-x-12 sm:flex-row sm:space-y-0 sm:mt-4 md:flex-row lg:flex-row xl:flex-row space-x-4">
          <Link href="/" aria-label="Go to Home">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
              <IoHome className="text-xl text-gray-600" /> {/* Home Icon */}
            </div>
          </Link>

          <Link href="/Favourite" aria-label="Go to Favorites">
            <div
              onClick={toggleFavorite}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer relative"
            >
              <IoHeartSharp className="text-xl text-gray-600" />
              {isFavorite && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
          </Link>

          <Link href="/categories" aria-label="Go to Categories">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
              <IoGridSharp className="text-xl text-gray-600" />
            </div>
          </Link>

          {/* <Link href="/stop" aria-label="Go to Notifications">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer relative">
              <IoNotifications className="text-xl text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </Link> */}

<Link href="/contact" aria-label="Go to Contact">
      <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
        <FaInfoCircle className="text-xl text-gray-600" /> {/* Details Icon */}
      </div>
    </Link>

        </div>
      </nav>
    </>
  );
}
