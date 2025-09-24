'use client';

import React, { useState, useEffect } from 'react';
import { RiSearch2Line } from "react-icons/ri";
import { IoHome, IoHeartSharp, IoGridSharp, IoCartSharp} from 'react-icons/io5';
// import { MdLocalShipping } from 'react-icons/md';

// In JSX

import { FaUserShield, FaMicrophoneAlt } from 'react-icons/fa'; 
import Link from 'next/link';

// Extend the Window interface to include SpeechRecognition and webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Header() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0); 

  const toggleFavorite = () => {
    setIsFavorite((prevState) => !prevState);
  };

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: any) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        window.location.href = `/search?query=${searchQuery}`;
      }
    }
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(savedCart.length);
  }, []);

  const startVoiceSearch = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)() as any;
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      window.location.href = `/search?query=${transcript}`;
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
    };
  };

  return (
    <>
      <div className="w-full h-[80px] border-b-2 border-slate-100 bg-white"></div>

      <nav className="bg-white py-4 px-5 shadow-md flex flex-wrap items-center justify-between fixed top-0 left-0 w-full z-10">
  <div className="flex items-center justify-between w-full sm:w-auto">
    <div className="text-2xl font-bold text-blue-600">Car Rental</div>

    {/* Search Box */}
    <div className="relative w-full sm:w-[350px] md:w-[400px] lg:w-[492px] h-[40px] sm:h-[44px] mt-3 sm:mt-0">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyUp={handleSearch}
        placeholder="Search something here"
        className="w-full h-full border border-gray-300 rounded-full py-2 px-4 pl-10 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
        <RiSearch2Line />
      </div>
      <button
        onClick={startVoiceSearch}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-full"
      >
        <FaMicrophoneAlt className="text-lg" />
      </button>
    </div>
  </div>

  {/* Navigation Icons */}
  <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 sm:gap-x-6 mt-4 sm:mt-0">
    <Link href="/" aria-label="Go to Home">
      <div className="relative group w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
        <IoHome className="text-xl text-gray-600" />
      </div>
    </Link>

    <Link href="/Favourite" aria-label="Go to Favorites">
      <div onClick={toggleFavorite} className="relative group w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
        <IoHeartSharp className="text-xl text-gray-600" />
        {isFavorite && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </div>
    </Link>

    <Link href="/categories" aria-label="Go to Categories">
      <div className="relative group w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
        <IoGridSharp className="text-xl text-gray-600" />
      </div>
    </Link>

    <Link href="/cart" aria-label="Go to Cart">
      <div className="relative group w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
        <IoCartSharp className="text-xl text-gray-600" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </div>
    </Link>

    <Link href="/dashboard" aria-label="Go to Admin Dashboard">
      <div className="relative group w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer">
        <FaUserShield className="text-xl text-gray-600" />
      </div>
    </Link>
  </div>
</nav>

    </>
  );
}
