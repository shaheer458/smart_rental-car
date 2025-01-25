"use client"; // Mark this as a client component

import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client'; // Import the Sanity client
import Link from 'next/link';
import Head from 'next/head'; // Import Head for dynamic page title
import Image from 'next/image'; // Import Image for optimization

const CarDetailsPage = ({ params }: { params: { id: string } }) => {
  const [car, setCar] = useState<any | null>(null); // Store car data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    console.log('Fetching data for car with ID:', params.id); // Log the ID
    const fetchCarData = async () => {
      const query = `*[_type == "carDataTypes" && _id == $id] {
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
        const data = await client.fetch(query, { id: params.id });
        console.log('Car data fetched:', data); // Log the fetched data
        if (data.length > 0) {
          setCar(data[0]); // Set the car data if found
        } else {
          setCar(null); // If no data, set car to null
        }
      } catch (error) {
        console.error('Error fetching car data:', error);
        setError('Failed to load car data. Please try again later.');
      } finally {
        setLoading(false); // Set loading to false after the request is completed
      }
    };

    fetchCarData(); // Fetch data using the id from params
  }, [params.id]); // Depend on params.id

  if (loading) return <p>Loading...</p>;

  if (error) return <p>{error}</p>;

  if (!car) return <p>Car not found</p>;

  return (
    <div className="p-6 h-full">
      <Head>
        <title>{car.name} - Car Details</title> {/* Dynamic title for SEO */}
      </Head>
      <h2 className="text-xl font-bold text-slate-400 text-left ml-4 mb-8">{car.name}</h2>

      <div className="flex border rounded-lg p-4 bg-white shadow-lg">
        {/* Left side: Image */}
        <div className="w-1/3">
          <Image
            src={car.image_url || '/path/to/default-image.jpg'} // Fallback to a default image if no image is available
            alt={car.name}
            width={500} // Specify width for next/image
            height={300} // Specify height for next/image
            className="w-full h-36 object-cover rounded-lg"
          />
        </div>

        {/* Right side: Car Details */}
        <div className="w-1/3 pl-6"> {/* Adjusted width */}
          <h3 className="text-lg font-semibold mt-4">{car.name}</h3>
          <p className="text-sm text-gray-600">{car.type}</p>
          <p className="text-sm text-gray-600">Fuel Capacity: {car.fuelCapacity}</p>
          <p className="text-sm text-gray-600">Transmission: {car.transmission}</p>
          <p className="text-sm text-gray-600">Seating Capacity: {car.seatingCapacity}</p>
          <p className="text-sm text-black font-bold">Price per Day: {car.pricePerDay}</p>
          
          {/* Rent Now Button */}
          <Link href={`/payment?carId=${car._id}`}> 
            <button 
              className="gap-2 self-start px-6 py-3 mt-4 text-base font-medium tracking-tight text-center text-white bg-[#3563E9] rounded min-h-[10px] w-[130px] whitespace-nowrap"
            >
              Rent Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
