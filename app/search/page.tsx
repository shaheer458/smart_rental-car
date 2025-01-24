'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';  // to get query params from URL
import { client } from '@/sanity/lib/client'; // Ensure you have a correct Sanity client setup
import Image from 'next/image';

const SearchPage = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';  // Get the query from the URL

  useEffect(() => {
    if (query.trim() === '') {
      setLoading(false);
      return; // Don't fetch if the query is empty
    }

    // Sanity query to fetch car data based on search query
    const searchQuery = `*[_type == "carDataTypes" && name match $query] {
      _id,
      name,
      type,
      fuelCapacity,
      transmission,
      seatingCapacity,
      pricePerDay,
      "image_url": image.asset->url
    }`;

    const fetchCarsByQuery = async () => {
      try {
        const results = await client.fetch(searchQuery, { query: `${query}*` });
        setCars(results);
      } catch (error) {
        console.error('Error fetching cars:', error.message || error);
        setCars([]);
      }
      setLoading(false);
    };

    fetchCarsByQuery();
  }, [query]);

  return (
    <div className="search-results p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Search Results for: &quot;{query}&quot;
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car._id} className="car-card bg-white p-4 rounded-lg shadow-md">
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={car.image_url || '/placeholder.png'} // Use fallback image if image_url is empty
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
                <p className="text-sm text-gray-600">Price per day: {car.pricePerDay}</p>
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
