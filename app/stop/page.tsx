'use client';

import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Car {
  carName: string;
  isAvailable: boolean;
}

interface CarStop {
  name: string;
  location: string;
  cars: Car[];
}

const CarStopPage: React.FC = () => {
  const [carStops, setCarStops] = useState<CarStop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch car stops and cars data from Sanity
  const fetchCarStops = async () => {
    try {
      const data = await client.fetch('*[_type == "carStop"]');
      setCarStops(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching car stops data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarStops();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="car-stop-page p-6">
      <h1 className="text-xl font-bold">Car Stops and Availability</h1>

      {carStops.length === 0 ? (
        <p>No car stops available.</p>
      ) : (
        <div className="flex flex-wrap gap-6 mt-6">
          {carStops.map((stop, index) => (
            <Card key={index} className="w-full md:w-[48%] lg:w-[30%]">
              <CardHeader>
                <CardTitle>{stop.name}</CardTitle>
                <CardDescription>{stop.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  <h3 className="font-semibold">Available Cars:</h3>
                  <ul className="mt-2">
                    {stop.cars.length === 0 ? (
                      <p>No cars available at this stop.</p>
                    ) : (
                      stop.cars.map((car, carIndex) => (
                        <li key={carIndex} className="flex justify-between items-center mt-2">
                          <span>{car.carName}</span>
                          <span
                            className={`text-sm font-semibold ${car.isAvailable ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {car.isAvailable ? 'Available' : 'Not Available'}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarStopPage;
