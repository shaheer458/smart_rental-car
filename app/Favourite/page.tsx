"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { client } from "@/sanity/lib/client"; // Import Sanity client
import Link from "next/link";
import Image from "next/image"; // Import Image from next/image for better image optimization

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<string[]>([]); // Store favorite car ids
  const [favoriteCarsData, setFavoriteCarsData] = useState<any[]>([]); // Store actual car data
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [error, setError] = useState<string | null>(null); // Store error message
  const [page, setPage] = useState<number>(1); // Page for pagination
  const [carsPerPage] = useState<number>(6); // Number of cars to load per page

  // Fetch favorite car IDs from localStorage and store them
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    let parsedFavorites: Record<string, boolean> = {};

    try {
      parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : {};
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
    }

    const favoriteCarIds = Object.keys(parsedFavorites).filter(
      (carId) => parsedFavorites[carId]
    );
    setFavorites(favoriteCarIds); // Store the ids in state
  }, []);

  // Fetch car data only if favorite cars exist
  useEffect(() => {
    if (favorites.length === 0) return; // Skip fetching if no favorites

    setLoading(true); // Start loading when fetching data
    const fetchFavoriteCars = async () => {
      const start = (page - 1) * carsPerPage;
      const end = start + carsPerPage;
      const favoriteCarIdsToFetch = favorites.slice(start, end);

      const query = `*[_type == "carData" && _id in $carIds] {
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
        const data = await client.fetch(query, { carIds: favoriteCarIdsToFetch });
        setFavoriteCarsData((prevData) => [...prevData, ...data]); // Append new data to existing data
      } catch (error) {
        console.error("Error fetching favorite cars data:", error);
        setError("Failed to load favorite cars. Please try again later.");
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };

    fetchFavoriteCars();
  }, [favorites, page]); // Fetch data when favorites or page changes

  // Memoized function to render each car (use React.memo for child components)
  const CarCard = React.memo(({ car }: { car: any }) => (
    <div key={car._id} className="border rounded-lg p-4 bg-white shadow-lg">
      <h3 className="text-lg font-semibold mt-4">{car.name}</h3>
      <Image
        src={car.image_url}
        alt={car.name}
        width={500} // Specify width for next/image
        height={300} // Specify height for next/image
        className="w-full h-32 object-cover rounded-t-lg"
        loading="lazy"
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
      <div className="mt-2">
        <p className="text-sm text-black font-bold">Price per Day: {car.pricePerDay}</p>
      </div>

      {/* "Rent Now" button now properly uses car details */}
      <div className="text-center mt-4">
        <Link href={`/payment?carId=${car._id}`}>
          <button
            className="gap-2 self-start px-6 py-3 mt-1 text-base font-medium tracking-tight text-center text-white bg-[#3563E9] rounded min-h-[10px] w-[130px] whitespace-nowrap"
            aria-label={`Rent ${car.name} now`} // car is available here
          >
            Rent Now
          </button>
        </Link>
      </div>
    </div>
  ));

  // Memoized car components
  const carComponents = useMemo(() => {
    return favoriteCarsData.map((car) => <CarCard key={car._id} car={car} />);
  }, [favoriteCarsData, CarCard]); // Add CarCard to dependencies

  // Pagination controls
  const handleLoadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  if (loading && favoriteCarsData.length === 0) {
    return <div className="text-center text-gray-500">Loading your favorite cars...</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-xl font-bold text-slate-400 text-left ml-4 mb-8">Your Favorite Cars</h2>

      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : favoriteCarsData.length === 0 ? (
        <p className="text-center text-gray-500">No favorite cars added yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {carComponents}
          </div>
          <div className="text-center mt-4">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 mt-4 text-base font-medium tracking-tight text-center text-white bg-[#3563E9] rounded min-h-[10px] w-[150px]"
            >
              Load More
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
