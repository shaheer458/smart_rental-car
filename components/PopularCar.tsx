"use client"; // Mark this as a client component

import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client"; // Import Sanity client
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component for optimization

// Define the type for Car data
interface Car {
  _id: string;
  name: string;
  type: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: number;
  pricePerDay: string;
  image_url: string;
}

const PopularPage = () => {
  const [cars, setCars] = useState<Car[]>([]); // Store car data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({}); // Manage favorites

  // Fetch popular cars data from Sanity CMS
  useEffect(() => {
    const fetchCars = async () => {
      const query = `*[_type == "carDataTypes" && "popular" in tags] {
        _id,
        name,
        type,
        fuelCapacity,
        transmission,
        seatingCapacity,
        pricePerDay,
        "image_url": image.asset->url
      }`;

      try {
        const data = await client.fetch(query);
        setCars(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars data:", error);
        setLoading(false);
      }
    };

    fetchCars();

    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "{}");
    setFavorites(savedFavorites); // Set initial favorites state
  }, []);

  // Toggle favorite status
  const handleFavoriteToggle = (carId: string) => {
    const updatedFavorites = { ...favorites, [carId]: !favorites[carId] };
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save to localStorage
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-xl font-bold text-slate-400 text-left ml-4 mb-8">Popular Cars</h2>

      {/* Show loading message or car grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading cars...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {cars.map((car) => (
            <div key={car._id} className="border rounded-lg p-4 bg-white shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mt-4">{car.name}</h3>
                <div
                  className="cursor-pointer"
                  onClick={() => handleFavoriteToggle(car._id)}
                >
                  <Image
                    src={favorites[car._id] ? "/love4.png" : "/love5.png"}
                    alt="Heart Icon"
                    width={24} // Set the width of the heart icon
                    height={24} // Set the height of the heart icon
                  />
                </div>
                {favorites[car._id] && <span className="text-sm text-red-500 font-semibold">Favourite</span>}
              </div>
              <p className="text-sm text-gray-600">{car.type}</p>

              {/* Use Next.js Image component for better optimization */}
              <Image
                src={car.image_url}
                alt={car.name}
                width={500}  // Specify width
                height={300} // Specify height
                className="w-full h-22 object-cover rounded-t-lg"
              />

<div className="flex gap-3 items-center justify-center">
  {/* Fuel Capacity */}
  <div className="flex">
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/bb9f5fa088a33a8329469c11ed8f42f7df3e0fd11b9aa0921af94d8d3307f051?placeholderIfAbsent=true&apiKey=5967db0a3a5740a580d3441f6f0ec2df"
      alt="Fuel Icon"
      width={24}
      height={24}
    />
    <p className="text-sm text-gray-600">{car.fuelCapacity}</p>
  </div>

  {/* Transmission */}
  <div className="flex">
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/563fd9367e8be9e271233fa362e88c8b2205c920475aad51a787f2599d87477e?placeholderIfAbsent=true&apiKey=5967db0a3a5740a580d3441f6f0ec2df" // Update this URL to a transmission icon
      alt="Transmission Icon"
      width={24}
      height={24}
    />
    <p className="text-sm text-gray-600">{car.transmission}</p>
  </div>

  {/* Seating Capacity */}
  <div className="flex">
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd12c9762ffaa585959a2bb1c514f631f14a3524f88d9c2bd9d3da13bf9fa3d9?placeholderIfAbsent=true&apiKey=5967db0a3a5740a580d3441f6f0ec2df" // Update this URL to a seating capacity icon
      alt="Capacity Icon"
      width={24}
      height={24}
    />
    <p className="text-sm text-gray-600">{car.seatingCapacity}</p>
  </div>
</div>


              <div>
                <p className="text-sm text-black font-bold">Price per Day: {car.pricePerDay}</p>
                <Link href={`/payment`}>
                  <button
                    className="gap-2 self-start px-6 py-3 mt-1 text-base font-medium tracking-tight text-center text-white bg-[#3563E9] rounded min-h-[10px] w-[130px] whitespace-nowrap"
                    aria-label={`Rent ${car.name} now`}
                  >
                    Rent Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularPage;
