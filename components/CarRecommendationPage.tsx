'use client'; // Mark this as a client component

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

const CarRecommendationPage = () => {
  const [cars, setCars] = useState<Car[]>([]); // Store car data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({}); // Manage favorites
  const [visibleCars, setVisibleCars] = useState<number>(8); // Initially show 8 cars
  const [showLess, setShowLess] = useState<boolean>(false); // Track the state for "Show Less"

  // Fetch cars data from Sanity CMS
  useEffect(() => {
    const fetchCars = async () => {
      const query = `*[_type == "carDataTypes" && "recommended" in tags] {
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
        console.log("Fetched cars:", data); // Log to check if data is fetched properly

        if (data.length === 0) {
          console.log("No cars found"); // Log if no data found
        }

        // Log image URLs to check if they're correct
        data.forEach((car: any) => {
          console.log("Car Image URL:", car.image_url);
        });

        setCars(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cars data:", error);
        setLoading(false);
      }
    };

    // Call fetchCars function only on the client side
    if (typeof window !== 'undefined') {
      fetchCars();
    }

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

  // Handle "Show More" functionality
  const handleShowMore = () => {
    setVisibleCars((prev) => prev + 8); // Show 8 more cars
    setShowLess(true); // Show "Show Less" button
  };

  // Handle "Show Less" functionality (fixed)
  const handleShowLess = () => {
    setVisibleCars(8); // Reset to initial state
    setShowLess(false); // Hide the "Show Less" button
  };

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-xl font-bold text-slate-400 text-left ml-4 mb-8">
        Recommended Cars
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading cars...</p>
        ) : (
          cars.slice(0, visibleCars).map((car) => (
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
                {favorites[car._id] && (
                  <span className="text-sm text-red-500 font-semibold">Favourite</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{car.type}</p>

              {/* Use Next.js Image component for better optimization */}
              <Image
                src={car.image_url}
                alt={car.name}
                width={500} // Specify width
                height={300} // Specify height
                className="w-full h-22 object-cover rounded-t-lg"
              />

              <div className="flex gap-3 items-center justify-center">
                {/* Fuel Capacity */}
                <div className="flex">
                  <img
                    loading="lazy"
                    src="/fuel-icon.png"
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
                    src="/transmission-icon.png"
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
                    src="/capacity-icon.png"
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
          ))
        )}
      </div>

      {/* Show the "Show More Cars" and "Show Less Cars" buttons */}
      <div className="flex justify-center items-start pt-4 gap-4">
        {cars.length > visibleCars && (
          <button
            onClick={handleShowMore}
            className="h-10 w-40 text-white bg-blue-500 rounded"
          >
            Show More Cars
          </button>
        )}

        {showLess && visibleCars > 8 && (
          <button
            onClick={handleShowLess}
            className="h-10 w-40 text-white bg-blue-500 rounded"
          >
            Show Less Cars
          </button>
        )}
      </div>
    </div>
  );
};

export default CarRecommendationPage;
