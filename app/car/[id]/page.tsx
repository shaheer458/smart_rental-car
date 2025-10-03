"use client"; // client component

import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

// Define proper typing for car object
interface Car {
  _id: string;
  name: string;
  type: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: string;
  pricePerDay: number;
  image_url: string;
}

interface CarDetailsPageProps {
  params: {
    id: string;
  };
}

const CarDetailsPage: React.FC<CarDetailsPageProps> = ({ params }) => {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        setCar(data[0] || null); // safely set car or null
      } catch (err) {
        console.error("Error fetching car data:", err);
        setError("Failed to load car data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!car) return <p>Car not found</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Head>
        <title>{car.name} - Car Details</title>
        <meta name="description" content={`Details of ${car.name} car`} />
      </Head>

      <h1 className="text-2xl font-bold mb-6">{car.name}</h1>

      <div className="flex flex-col lg:flex-row gap-6 bg-white p-6 rounded-lg shadow-md">
        {/* Image */}
        <div className="w-full lg:w-1/3">
          <Image
            src={car.image_url || "/placeholder.png"}
            alt={car.name}
            width={600}
            height={400}
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p><strong>Type:</strong> {car.type}</p>
            <p><strong>Fuel Capacity:</strong> {car.fuelCapacity}</p>
            <p><strong>Transmission:</strong> {car.transmission}</p>
            <p><strong>Seating Capacity:</strong> {car.seatingCapacity}</p>
            <p><strong>Price per Day:</strong> ${car.pricePerDay}</p>
          </div>

          <div className="mt-4">
            <Link href={`/payment?carId=${car._id}`}>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Rent Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
