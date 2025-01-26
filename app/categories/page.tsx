
'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { client } from '@/sanity/lib/client'; // Assuming you have Sanity client set up
import Image from 'next/image';
import Link from 'next/link';

// Define types for the car data
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

const CategoriesPage = () => {
  const [carTypes, setCarTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // To handle errors

  // Fetch all car types only once
  useEffect(() => {
    const fetchCarTypes = async () => {
      const query = `*[_type == "carData"] | order(type) {
        type
      }`;
      try {
        const allCars = await client.fetch(query);
        const uniqueTypes: string[] = [];

        allCars.forEach((car: { type: string }) => {
          if (!uniqueTypes.includes(car.type)) {
            uniqueTypes.push(car.type);
          }
        });

        setCarTypes(uniqueTypes);
      } catch (error) {
        setError('Failed to load car types. Please try again later.');
      }
    };

    fetchCarTypes();
  }, []);

  const fetchCarsByType = async (type: string): Promise<Car[]> => {
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
      return [];
    }
  };

  const handleTypeClick = async (type: string) => {
    setSelectedType(type);
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const fetchedCars = await fetchCarsByType(type);
      setCars(fetchedCars);
    } catch (error) {
      setError('Failed to load cars for this type.');
    } finally {
      setLoading(false);
    }
  };

  // Memoized Car Card to avoid unnecessary re-renders
  const CarCard: React.FC<{ car: Car }> = React.memo(({ car }) => (
    <div key={car._id} className="car-card bg-white p-4 rounded-lg shadow-md">
      <div className="relative w-full h-40 mb-4">
        <Image
          src={car.image_url || '/placeholder.png'}
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

      <div className="text-center mt-4">
        <Link href={`/payment?carId=${car._id}`}>
          <button
            className="gap-2 self-start px-6 py-3 mt-1 text-base font-medium tracking-tight text-center text-white bg-[#3563E9] rounded min-h-[10px] w-[130px] whitespace-nowrap"
            aria-label={`Rent ${car.name} now`}
          >
            Rent Now
          </button>
        </Link>
      </div>
    </div>
  ));

  CarCard.displayName = 'CarCard';

  // Memoized car types to avoid unnecessary re-renders
  const carTypesList = useMemo(
    () =>
      carTypes.map((type) => (
        <button
          key={type}
          className={`px-4 py-2 rounded-lg ${selectedType === type ? 'bg-blue-700' : 'bg-blue-500'}`}
          onClick={() => handleTypeClick(type)}
        >
          {type}
        </button>
      )),
    [carTypes, selectedType] // Recompute only if carTypes or selectedType change
  );

  return (
    <div className="categories-page w-full flex flex-col items-center p-4">
      <h1 className="text-2xl font-semibold mb-6">Car Categories</h1>

      <div className="car-types flex flex-wrap gap-4 mb-8">{carTypesList}</div>

      {loading && <div className="loading-spinner">Loading cars...</div>}

      {error && <div className="error-message text-red-500">{error}</div>}

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
