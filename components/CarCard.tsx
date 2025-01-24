'use client';

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image"; // Import the Image component

// Define the types for the CarCard component props
type CarCardProps = {
  name: string;
  type: string;
  image: string;
  fuelCapacity: string;
  transmission: string;
  capacity: string;
  price: number;
  discountedPrice?: number;
  favoriteIcon: string;
};

export const CarCard: React.FC<CarCardProps> = ({
  name,
  type,
  image,
  fuelCapacity,
  transmission,
  capacity,
  price,
  discountedPrice,
  favoriteIcon
}) => {
  // State to track if the heart icon is favorited
  const [isFavorited, setIsFavorited] = useState(false);

  // Toggle favorite state on single click
  const handleClick = () => {
    setIsFavorited(true); // Change color to red on single click
  };

  // Reset to non-favorited state on double click
  const handleDoubleClick = () => {
    setIsFavorited(false); // Change color back to default (black)
  };

  return (
    <div className="flex overflow-hidden flex-col p-6 bg-white rounded-xl min-w-[240px] w-[304px] max-md:px-5 relative border border-gray-50">
      {/* Heart Icon Positioning */}
      <Image
        loading="lazy"
        src={favoriteIcon}
        alt="Favorite Icon"
        width={24} // Set a specific width for the image
        height={24} // Set a specific height for the image
        className={`absolute top-3 right-3 w-6 aspect-square cursor-pointer z-10 hover:text-red-600 ${isFavorited ? "text-red-600" : "text-black"}`} 
        onClick={handleClick}  // Handle single click
        onDoubleClick={handleDoubleClick} // Handle double click
      />
      
      <div className="flex gap-5 justify-between font-bold">
        <div className="flex flex-col">
          <div className="text-xl tracking-tight text-gray-900">{name}</div>
          <div className="mt-1 text-sm tracking-tight text-slate-400">{type}</div>
        </div>
      </div>
      
      {/* Car Image */}
      <div className="relative w-full h-48"> 
        <Image
          loading="lazy"
          src={image}
          alt={`${name} car`}
          width={300} // Set the width of the image
          height={150} // Set the height of the image
          className="object-contain self-center mt-16 max-w-full aspect-[3.18] w-[300px] max-md:mt-10"
        />
      </div>
      
      <div className="flex gap-4 items-start mt-16 text-sm font-medium leading-5 text-slate-400 max-md:mt-10">
        <div className="flex gap-1.5 items-start tracking-tight whitespace-nowrap">
          <Image
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb9f5fa088a33a8329469c11ed8f42f7df3e0fd11b9aa0921af94d8d3307f051?placeholderIfAbsent=true&apiKey=5967db0a3a5740a580d3441f6f0ec2df"
            alt="Fuel Icon"
            width={24} // Set width for the fuel icon
            height={24} // Set height for the fuel icon
            className="object-contain shrink-0"
          />
          <div className="w-7">{fuelCapacity}</div>
        </div>
        <div className="flex gap-1 items-start whitespace-nowrap">
          <Image
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/563fd9367e8be9e271233fa362e88c8b2205c920475aad51a787f2599d87477e?placeholderIfAbsent=true&apiKey=5967db0a3a5740a580d3441f6f0ec2df"
            alt="Transmission Icon"
            width={24} // Set width for the transmission icon
            height={24} // Set height for the transmission icon
            className="object-contain shrink-0"
          />
          <div className="w-12">{transmission}</div>
        </div>
        <div className="flex gap-1.5 items-start">
          <Image
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd12c9762ffaa585959a2bb1c514f631f14a3524f88d9c2bd9d3da13bf9fa3d9?placeholderIfAbsent=true&apiKey=5967db0a3a5740a580d3441f6f0ec2df"
            alt="Capacity Icon"
            width={24} // Set width for the capacity icon
            height={24} // Set height for the capacity icon
            className="object-contain shrink-0"
          />
          <div className="w-[60px]">{capacity}</div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-5 w-full">
        <div className="flex flex-col font-bold text-slate-900">
          <div className="text-xl">
            ${price}.00/ <span className="text-sm text-slate-900">day</span>
          </div>
          {discountedPrice && (
            <div className="mt-1 text-sm">${discountedPrice}.00</div>
          )}
        </div>
        <Link href="/payment">
          <button
            className="gap-2 self-start px-6 py-3 mt-1 text-base font-medium tracking-tight text-center text-white bg-[#3563E9] rounded min-h-[10px] w-[130px] whitespace-nowrap"
            aria-label={`Rent ${name} now`}
          >
            Rent Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
