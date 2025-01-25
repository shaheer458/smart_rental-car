"use client"; // Mark this as a client component
import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client'; // Import the Sanity client
import Link from 'next/link'; // Link for navigation
import Head from 'next/head'; // For dynamic page title
import Image from 'next/image'; // Optimized image component

const CarDetailsPage = ({ carData }: { carData: any }) => {
  const [car, setCar] = useState<any | null>(carData); // Initialize with the fetched car data
  const [loading, setLoading] = useState<boolean>(false); // Remove redundant loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (!car) {
      setLoading(true);
      setError('Car not found');
    }
  }, [car]);

  if (!car) return <p>{error || 'Car not found'}</p>;

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
            src={car.image_url || '/path/to/default-image.jpg'} // Use fallback if image_url is missing
            alt={car.name}
            width={500} // Specify width for next/image
            height={300} // Specify height for next/image
            className="w-full h-36 object-cover rounded-lg"
          />
        </div>

        {/* Right side: Car Details */}
        <div className="w-2/3 pl-6">
          <h3 className="text-lg font-semibold mt-4">{car.name}</h3>
          <p className="text-sm text-gray-600">{car.type}</p>
          <p className="text-sm text-gray-600">Fuel Capacity: {car.fuelCapacity}</p>
          <p className="text-sm text-gray-600">Transmission: {car.transmission}</p>
          <p className="text-sm text-gray-600">Seating Capacity: {car.seatingCapacity}</p>
          <p className="text-sm text-black font-bold">Price per Day: {car.pricePerDay}</p>

          {/* Rent Now Button */}
          <Link href={`/payment?carId=${car._id}`}>
            <button className="gap-2 self-start px-6 py-3 mt-4 text-base font-medium tracking-tight text-center text-white bg-[#3563E9] rounded min-h-[10px] w-[130px] whitespace-nowrap">
              Rent Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Fetch car data server-side
export async function getServerSideProps({ params }: { params: { id: string } }) {
  try {
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

    const data = await client.fetch(query, { id: params.id });

    if (data.length > 0) {
      return {
        props: {
          carData: data[0], // Pass fetched car data to the page as props
        },
      };
    } else {
      return {
        props: {
          carData: null, // If no data is found, return null
        },
      };
    }
  } catch (error) {
    console.error('Error fetching car data:', error);
    return {
      props: {
        carData: null, // Return null if an error occurs
      },
    };
  }
}

export default CarDetailsPage;
