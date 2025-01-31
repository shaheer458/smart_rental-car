'use client';

import { ArrangeVertical } from "iconsax-react";
import React, { useState } from "react";

// Helper component for location, date, and time selection
const LocationDateTimePicker = ({
  label,
  location,
  date,
  time,
  onLocationChange,
  onDateChange,
  onTimeChange,
}: {
  label: string;
  location: string;
  date: string; // Updated to a string for <input type="date">
  time: string;
  onLocationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  const locations = [
    "Nawabshah (Sakrand Road)",
    "Sakrand",
    "Saeedabad",
    "Hala",
    "Hyderabad",
    "Karachi",
  ];

  return (
    <section className="bg-white rounded-[10px] p-4 lg:p-6 lg:w-2/5">
      <div className="flex items-center mb-4">
        <input
          id={`radio-${label}`}
          type="radio"
          value={label}
          name="default-radio"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor={`radio-${label}`} className="ml-2 text-base font-semibold text-[#1A202C]">
          {label}
        </label>
      </div>

      <div className="flex justify-between items-center">
        {/* Location Dropdown */}
        <div className="w-[30%] border-r-[1px] border-[#C3D4E966]">
          <span className="text-[#1A202C] font-bold text-base">Locations</span>
          <select
            className="w-full py-2 focus:outline-none text-[#90A3BF] font-normal text-xs bg-white"
            value={location}
            onChange={onLocationChange}
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Date Input */}
        <div className="w-[30%] border-r-[1px] border-[#C3D4E966] p-2">
          <span className="text-[#1A202C] font-bold text-base block mb-2">Date</span>
          <input
            type="date"
            value={date}
            onChange={onDateChange}
            className="w-full py-2 focus:outline-none border-[#C3D4E966] text-[#90A3BF] text-xs bg-white border rounded"
          />
        </div>

        {/* Time Dropdown */}
        <div className="w-[30%]">
          <span className="text-[#1A202C] font-bold text-base">Time</span>
          <select
            className="w-full py-2 focus:outline-none border-[#C3D4E966] text-[#90A3BF] text-xs bg-white"
            value={time}
            onChange={onTimeChange}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={String(i + 1).padStart(2, "0")}>
                {String(i + 1).padStart(2, "0")}:00
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

const DateTimePicker = () => {
  // State hooks for pickup and dropoff
  const [pickup, setPickup] = useState({
    location: "Nawabshah (Sakrand Road)",
    date: new Date().toISOString().split("T")[0], // Default date as string
    time: "07",
  });

  const [dropoff, setDropoff] = useState({
    location: "Nawabshah (Sakrand Road)",
    date: new Date().toISOString().split("T")[0], // Default date as string
    time: "01",
  });

  return (
    <div className="mt-8 mx-6 lg:mx-0 lg:px-16 lg:flex lg:justify-between lg:items-center">
      {/* Pickup Section */}
      <LocationDateTimePicker
        label="Pick-Up"
        location={pickup.location}
        date={pickup.date}
        time={pickup.time}
        onLocationChange={(e) => setPickup({ ...pickup, location: e.target.value })}
        onDateChange={(e) => setPickup({ ...pickup, date: e.target.value })}
        onTimeChange={(e) => setPickup({ ...pickup, time: e.target.value })}
      />

      {/* Separator Icon */}
      <div className="lg:mx-[44px] w-[60px] h-[60px] mx-auto z-10 bg-[#3563E9] rounded-[10px] flex justify-center items-center cursor-pointer shadow-[#10329347] shadow-xl">
        <ArrangeVertical color="#ffffff" />
      </div>

      {/* Dropoff Section */}
      <LocationDateTimePicker
        label="Drop-Off"
        location={dropoff.location}
        date={dropoff.date}
        time={dropoff.time}
        onLocationChange={(e) => setDropoff({ ...dropoff, location: e.target.value })}
        onDateChange={(e) => setDropoff({ ...dropoff, date: e.target.value })}
        onTimeChange={(e) => setDropoff({ ...dropoff, time: e.target.value })}
      />
    </div>
  );
};

export default DateTimePicker;
