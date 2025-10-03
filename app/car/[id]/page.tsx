"use client"; // Client component

import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { client } from "@/sanity/lib/client"; // Import the Sanity client
import Link from "next/link";
import Head from "next/head"; // Import Head for dynamic page title
import Image from "next/image"; // Import Image for optimization

// ✅ Proper type for params
=======
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

>>>>>>> b04bb791b9098cb2e1a5ecd224201daff844630e
interface CarDetailsPageProps {
  params: {
    id: string;
  };
}

<<<<<<< HEAD
const CarDetailsPage: React.FC<CarDetailsPageProps> = ({ params }) => {
  const [car, setCar] = useState<any | null>(null); // Store car data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    console.log("Fetching data for car with ID:", params.id); // Log the ID
=======
const CarDetailsPage = ({ params }: CarDetailsPageProps) => {
  const [car, setCar] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
>>>>>>> b04bb791b9098cb2e1a5ecd224201daff844630e
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
<<<<<<< HEAD
        console.log("Car data fetched:", data); // Log the fetched data
=======
>>>>>>> b04bb791b9098cb2e1a5ecd224201daff844630e
        if (data.length > 0) {
          setCar(data[0]);
        } else {
          setCar(null);
        }
<<<<<<< HEAD
      } catch (error) {
        console.error("Error fetching car data:", error);
=======
      } catch (err) {
        console.error("Error fetching car data:", err);
>>>>>>> b04bb791b9098cb2e1a5ecd224201daff844630e
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
    <div className="p-6 h-full">
      <Head>
        <title>{car.name} - Car Details</title>
      </Head>
<<<<<<< HEAD
=======

>>>>>>> b04bb791b9098cb2e1a5ecd224201daff844630e
      <h2 className="text-xl font-bold text-slate-400 text-left ml-4 mb-8">
        {car.name}
      </h2>

      <div className="flex flex-col lg:flex-row border rounded-lg p-4 bg-white shadow-lg">
        {/* Car Card */}
        <div className="car-card bg-white p-4 rounded-lg shadow-md">
          <div className="relative w-full h-40 mb-4">
            <Image
              src={car.image_url || "/placeholder.png"}
              alt={car.name}
              width={600}
              height={400}
              quality={75}
<<<<<<< HEAD
              style={{ objectFit: "cover" }} // ✅ Fixed: Next.js Image uses style, not objectFit prop
              loading="lazy"
              className="rounded-lg"
=======
              className="rounded-lg object-cover"
>>>>>>> b04bb791b9098cb2e1a5ecd224201daff844630e
            />
          </div>
          <h3 className="text-lg font-semibold">{car.name}</h3>
          <p className="text-sm text-gray-600">
            <strong>Type:</strong> {car.type}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Fuel Capacity:</strong> {car.fuelCapacity}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Transmission:</strong> {car.transmission}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Seating Capacity:</strong> {car.seatingCapacity}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Price per Day:</strong> {car.pricePerDay}
          </p>
<<<<<<< HEAD
=======

>>>>>>> b04bb791b9098cb2e1a5ecd224201daff844630e
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

<<<<<<< HEAD
        {/* Car Details Side Section (Future expansion) */}
=======
        {/* Right side: More details (expandable later) */}
>>>>>>> b04bb791b9098cb2e1a5ecd224201daff844630e
        <div className="w-full lg:w-2/3 lg:pl-6 mt-4 lg:mt-0"></div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
