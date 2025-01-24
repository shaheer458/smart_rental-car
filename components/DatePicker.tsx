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
  date: string;
  time: string;
  onLocationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <section className="bg-white rounded-[10px] p-4 lg:p-6 lg:w-2/5">
    <div className="flex items-center mb-4">
      <input
        defaultChecked
        id={`radio-${label}`}
        type="radio"
        value=""
        name="default-radio"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
      />
      <label htmlFor={`radio-${label}`} className="ml-2 text-base font-semibold text-[#1A202C]">
        {label}
      </label>
    </div>

    <div className="flex justify-between items-center">
      <div className="w-[30%] border-r-[1px] border-[#C3D4E966]">
        <span className="text-[#1A202C] font-bold text-base">Locations</span>
        <select
          className="w-full py-2 focus:outline-none text-[#90A3BF] font-normal text-xs bg-white"
          value={location}
          onChange={onLocationChange}
        >
          <option value="Semarang">Semarang</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="Ge">Germany</option>
        </select>
      </div>

      <div className="w-[30%] border-r-[1px] border-[#C3D4E966]">
        <span className="text-[#1A202C] font-bold text-base block">Date</span>
        <select
          className="w-full py-2 focus:outline-none border-[#C3D4E966] text-[#90A3BF] text-xs bg-white"
          value={date}
          onChange={onDateChange}
        >
          <option value="20 July 2025">20 July 2025</option>
          <option value="21 July 2025">21 July 2025</option>
          <option value="22 July 2025">22 July 2025</option>
          <option value="23 July 2025">23 July 2025</option>
        </select>
      </div>

      <div className="w-[30%]">
        <span className="text-[#1A202C] font-bold text-base">Time</span>
        <select
          className="w-full py-2 focus:outline-none border-[#C3D4E966] text-[#90A3BF] text-xs bg-white"
          value={time}
          onChange={onTimeChange}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {String(i + 1).padStart(2, "0")}:00
            </option>
          ))}
        </select>
      </div>
    </div>
  </section>
);

const DatePicker = () => {
  // State hooks for pickup and dropoff information
  const [pickup, setPickup] = useState({
    location: "Semarang",
    date: "20 July 2025",
    time: "7",
  });

  const [dropoff, setDropoff] = useState({
    location: "Semarang",
    date: "21 July 2025",
    time: "1",
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

      {/* Icon to separate the two sections */}
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

export default DatePicker;
