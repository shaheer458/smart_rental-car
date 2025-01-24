"use client"; // Mark this as a client component

import { useState } from "react";
import Image from "next/image"; // Import Image component from Next.js

const DetailsRental = () => {
  // State management for pickup and dropoff details
  const [pickupLocation, setPickupLocation] = useState("Kota Semarang");
  const [pickupTime, setPickupTime] = useState("07:00");
  const [pickupDate, setPickupDate] = useState("20 July 2022");

  const [dropoffLocation, setDropoffLocation] = useState("Kota Semarang");
  const [dropoffTime, setDropoffTime] = useState("01:00");
  const [dropoffDate, setDropoffDate] = useState("21 July 2022");

  return (
    <div className="p-4 bg-white rounded-[10px] lg:w-[48%]">
      {/* Rental Details Section */}
      <section>
        <p className="text-[#1A202C] font-bold text-base lg:text-xl mb-6">
          Details Rental
        </p>

        <div className="flex justify-between items-baseline mt-6 lg:items-start">
          <div className="flex">
            {/* Replace <img> with <Image /> from Next.js */}
            <div className="relative h-[64px] w-[116px] mr-3 lg:h-[72px] lg:w-[132px] lg:mr-4">
              <Image
                src="/Maps.png" // Path to your image
                alt="view"
                layout="fill" // Automatically scales to parent container
                objectFit="cover" // Ensures the image covers the area
                className="rounded-lg"
              />
            </div>

            <div>
              <p className="text-[#1A202C] font-bold text-xl lg:text-2xl">
                Nissan GT - R
              </p>
              <span className="text-[#3D5278] block font-medium text-xs lg:text-sm mt-2">
                Sport Car
              </span>
            </div>
          </div>
          <span className="text-[#90A3BF] block font-medium text-xs lg:text-sm">
            #9761
          </span>
        </div>
      </section>

      {/* Pick-Up Section */}
      <section className="bg-white rounded-[10px] p-4 lg:p-6 lg:w-2/5">
        <div className="flex items-center mb-4">
          <input
            defaultChecked
            id="pickup-radio"
            type="radio"
            value=""
            name="pickup-radio"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
          <label htmlFor="pickup-radio" className="ml-2 text-base font-semibold text-[#1A202C]">
            Pick-Up
          </label>
        </div>

        <div className="flex justify-between items-center gap-[60px]">
          <div className="w-[100%] border-r-[1px] border-[#C3D4E966] pr-0">
            <span className="text-[#1A202C] font-bold text-base">Locations</span>
            <select
              className="w-full py-2 focus:outline-none text-[#90A3BF] font-normal text-xs bg-white"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option value="Semarang">Semarang</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="Ge">Germany</option>
            </select>
          </div>

          <div className="w-[100%] border-r-[1px] border-[#C3D4E966] pr-4">
            <span className="text-[#1A202C] font-bold text-base block">Date</span>
            <select
              className="w-full py-2 focus:outline-none border-[#C3D4E966] text-[#90A3BF] text-xs bg-white"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            >
              <option value="20 July 2022">20 July 2022</option>
              <option value="21 July 2022">21 July 2022</option>
              <option value="22 July 2022">22 July 2022</option>
              <option value="23 July 2022">23 July 2022</option>
            </select>
          </div>

          <div className="w-[30%]">
            <span className="text-[#1A202C] font-bold text-base">Time</span>
            <select
              className="w-full py-2 focus:outline-none border-[#C3D4E966] text-[#90A3BF] text-xs bg-white"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            >
              {["07:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "08:00", "09:00", "10:00", "11:00", "12:00"].map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Spacer Icon */}
      <div className="lg:mx-[44px] w-[60px] h-[60px] mx-auto z-10 bg-[#3563E9] rounded-[10px] flex justify-center items-center cursor-pointer shadow-[#10329347] shadow-xl"></div>

      {/* Drop-Off Section */}
      <section className="bg-white rounded-[10px] p-4 lg:p-6 lg:w-2/5">
        <div className="flex items-center mb-4">
          <input
            id="dropoff-radio"
            type="radio"
            value=""
            name="dropoff-radio"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
          />
          <label htmlFor="dropoff-radio" className="ml-2 text-base font-semibold text-[#1A202C]">
            Drop-Off
          </label>
        </div>

        <div className="flex justify-between items-center gap-[20px]">
          <div className="w-[100%] border-r-[1px] border-[#C3D4E966] pr-4">
            <span className="text-[#1A202C] font-bold text-base">Locations</span>
            <select
              className="w-full py-2 focus:outline-none text-[#90A3BF] font-normal text-xs bg-white"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
            >
              <option value="Semarang">Semarang</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="FR">France</option>
              <option value="Ge">Germany</option>
            </select>
          </div>

          <div className="w-[100%] border-r-[1px] border-[#C3D4E966] pr-4">
            <span className="text-[#1A202C] font-bold text-base block">Date</span>
            <select
              className="w-full py-2 focus:outline-none border-[#C3D4E966] text-[#90A3BF] text-xs bg-white"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
            >
              <option value="21 July 2022">21 July 2022</option>
              <option value="20 July 2022">20 July 2022</option>
              <option value="22 July 2022">22 July 2022</option>
              <option value="23 July 2022">23 July 2022</option>
              <option value="24 July 2022">24 July 2022</option>
            </select>
          </div>

          <div className="w-[30%]">
            <span className="text-[#1A202C] font-bold text-base">Time</span>
            <select
              className="w-full py-2 focus:outline-none border-[#C3D4E966] text-[#90A3BF] text-xs bg-white"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
            >
              {["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00"].map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Total Rental Price */}
      <ul className="pt-6 flex justify-between mt-6 border-t-[1px] border-[#C3D4E966]">
        <li>
          <p className="text-[#1A202C] font-bold text-base lg:text-xl">
            Total Rental Price
          </p>
          <span className="text-[#90A3BF] font-normal text-xs lg:font-medium lg:text-sm">
            Overall price rental
          </span>
        </li>
        <li className="text-[#1A202C] font-bold text-xl lg:text-[32px]">
          $80.00
        </li>
      </ul>
    </div>
  );
};

export default DetailsRental;
