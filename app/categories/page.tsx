'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { client } from '@/sanity/lib/client'; // Assuming you have Sanity client set up
import Image from 'next/image';
import Link from 'next/link';

// Function to fetch car data by type
const fetchCarsByType = async (type : any) => {
  const query = `*[_type == "carData" && type == $type] {
    _id,
    name,
    type,
    fuelCapacity,
    transmission,
    seatingCapacity,
    pricePerDay,
    "image_url": image.asset->url
  }`;

  const params = { type };
  try {
    const cars = await client.fetch(query, params);
    return cars;
  } catch (error) {
    console.error('Error fetching cars:', error);
    return []; // Return empty array if there's an error
  }
};

const CategoriesPage = () => {
  const [carTypes, setCarTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all car types only once
  useEffect(() => {
    const fetchCarTypes = async () => {
      const query = `*[_type == "carData"] | order(type) {
        type
      }`;
      const allCars = await client.fetch(query);
      const uniqueTypes = [...new Set(allCars.map((car) => car.type))]; // Get unique car types
      setCarTypes(uniqueTypes);
    };

    fetchCarTypes();
  }, []);

  // Direct handler to fetch cars by type (without debounce)
  const handleTypeClick = async (type) => {
    setSelectedType(type);
    setLoading(true); // Show loading indicator
    const fetchedCars = await fetchCarsByType(type);
    setCars(fetchedCars);
    setLoading(false); // Hide loading indicator
  };

  // Memoized Car Card to avoid unnecessary re-renders
  const CarCard = React.memo(({ car }) => (
    <div key={car._id} className="car-card bg-white p-4 rounded-lg shadow-md">
      {/* Image Container */}
      <div className="relative w-full h-40 mb-4">
        <Image
          src={car.image_url || '/placeholder.png'}
          alt={car.name}
          width={600}  // Ensure optimal width for large devices
          height={400} // Maintain aspect ratio
          quality={75}  // Adjust image quality for performance
          objectFit="cover"
          loading="lazy"
          className="rounded-lg"
        />
      </div>
      <h3 className="text-lg font-semibold">{car.name}</h3>
      <p className="text-sm text-gray-600">Fuel Capacity: {car.fuelCapacity}</p>
      <p className="text-sm text-gray-600">Transmission: {car.transmission}</p>
      <p className="text-sm text-gray-600">Seating Capacity: {car.seatingCapacity}</p>
      <p className="text-sm text-gray-600">Price per day: {car.pricePerDay}</p>

      <div className="text-center mt-4">
        <Link href={`/payment?carId=${car._id}`}>
          <button
            className="gap-2 self-start px-6 py-3 mt-1 text-base font-medium tracking-tight text-center text-white bg-[#3563E9] rounded min-h-[10px] w-[130px] whitespace-nowrap"
            aria-label={`Rent ${car.name} now`}  // car is available here
          >
            Rent Now
          </button>
        </Link>
      </div>
    </div>
  ));

  // Memoizing car types to avoid unnecessary re-renders
  const carTypesList = useMemo(() => {
    return carTypes.map((type) => (
      <button
        key={type}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={() => handleTypeClick(type)} // Trigger fetch on click
      >
        {type}
      </button>
    ));
  }, [carTypes]); // Only recompute if carTypes change

  return (
    <div className="categories-page w-full flex flex-col items-center p-4">
      <h1 className="text-2xl font-semibold mb-6">Car Categories</h1>

      {/* Display list of car types */}
      <div className="car-types flex flex-wrap gap-4 mb-8">
        {carTypesList}
      </div>

      {/* Display loading indicator */}
      {loading && <div>Loading cars...</div>}

      {/* Display cars based on selected type */}
      {selectedType && (
        <div className="car-details">
          <h2 className="text-xl font-semibold mb-4">{selectedType} Cars</h2>
          {cars.length > 0 ? (
            <div className="cars-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          ) : (
            <p>No cars available for this type.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
