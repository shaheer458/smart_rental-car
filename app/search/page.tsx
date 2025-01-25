'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { client } from '@/sanity/lib/client'; 
import Image from 'next/image';

const SearchPage = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); 
  const searchParams = useSearchParams();
  
  // Get the query from the URL, default to empty string if not found
  const query = searchParams.get('query') || ''; 

  // Define the GROQ query for fetching cars
  const searchQuery = `
    *[_type == "carDataTypes" && name match $searchQuery] {
      _id,
      name,
      type,
      fuelCapacity,
      transmission,
      seatingCapacity,
      pricePerDay,
      "image_url": image.asset->url
    }
  `;

  // Function to fetch the cars based on the query
  const fetchCars = async (query: string) => {
    try {
      setLoading(true); 
      setError(null); 
      const results = await client.fetch(searchQuery, { searchQuery: `${query}*` });
      setCars(results);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars whenever the query changes or when the page is loaded
  useEffect(() => {
    if (query.trim()) {
      fetchCars(query);
    } else {
      setCars([]); // Clear the cars if the query is empty
      setLoading(false); 
    }
  }, [query]);

  return (
    <div className="search-results p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Search Results for: &quot;{query}&quot;
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car._id} className="car-card bg-white p-4 rounded-lg shadow-md">
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={car.image_url || '/placeholder.png'} // Fallback image
                    alt={car.name}
                    width={600}
                    height={400}
                    quality={75}
                    objectFit="cover"
                    loading="lazy"
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold">{car.name}</h3>
                <p className="text-sm text-gray-600">Fuel Capacity: {car.fuelCapacity}</p>
                <p className="text-sm text-gray-600">Transmission: {car.transmission}</p>
                <p className="text-sm text-gray-600">Seating Capacity: {car.seatingCapacity}</p>
                <p className="text-sm text-gray-600">Price per day: ${car.pricePerDay}</p>
              </div>
            ))
          ) : (
            <p>No cars found for your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
