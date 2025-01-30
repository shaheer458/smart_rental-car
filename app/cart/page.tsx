'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Define car type with additional properties
interface Car {
  _id: string;
  name: string;
  pricePerDay: string;
  image_url: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: string;
  selected: boolean; // Added selected property for checkbox
  rentalDuration: number; // Added rentalDuration property
}

// Cart Page Component
const CartPage = () => {
  const [cart, setCart] = useState<Car[]>([]);

  useEffect(() => {
    // Load cart data from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Add 'selected' property and 'rentalDuration' to each car when loading from localStorage
    const updatedCart = savedCart.map((car: Car) => ({
      ...car,
      selected: false,
      rentalDuration: 1, // Default to 1 day
    }));
    setCart(updatedCart);
  }, []);

  // Remove a car from the cart
  const removeFromCart = (carId: string) => {
    const updatedCart = cart.filter((car) => car._id !== carId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Handle auto-tick and removal when clicking on a product
  const handleClick = (carId: string) => {
    const updatedCart = cart.map((car) =>
      car._id === carId ? { ...car, selected: !car.selected } : car
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // If checked, remove the car immediately
    if (updatedCart.find((car) => car._id === carId)?.selected) {
      removeFromCart(carId);
    }
  };

  // Update rental duration for a car
  const handleDurationChange = (carId: string, duration: number) => {
    const updatedCart = cart.map((car) =>
      car._id === carId ? { ...car, rentalDuration: duration } : car
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate the total price of all cars in the cart (taking rental duration into account)
  const totalPrice = cart.reduce((acc, car) => {
    const numericPrice = parseFloat(car.pricePerDay.replace(/[^\d.-]/g, ''));
    return !isNaN(numericPrice) ? acc + numericPrice * car.rentalDuration : acc;
  }, 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Your Rent Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((car) => (
            <div key={car._id} className="border rounded-lg p-4 bg-white shadow-lg">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleClick(car._id)}>
                <input
                  type="checkbox"
                  checked={car.selected}
                  readOnly
                  className="h-5 w-5"
                />
                <h3 className="text-lg font-semibold mt-4">{car.name}</h3>
              </div>
              <Image
                src={car.image_url}
                alt={car.name}
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-lg"
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
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/563fd9367e8be9e271233fa362e88c8b2205c920475aad51a787f2599d87477e?placeholderIfAbsent=true&apiKey=5967db0a3a5740a580d3441f6f0ec2df"
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
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd12c9762ffaa585959a2bb1c514f631f14a3524f88d9c2bd9d3da13bf9fa3d9?placeholderIfAbsent=true&apiKey=5967db0a3a5740a580d3441f6f0ec2df"
                    alt="Capacity Icon"
                    width={24}
                    height={24}
                  />
                  <p className="text-sm text-gray-600">{car.seatingCapacity}</p>
                </div>
              </div>
              <p className="text-gray-600 font-bold">Price per Day: {car.pricePerDay}</p>
              
              {/* Rental Duration Input */}
              <div className="mt-2">
                <label htmlFor={`duration-${car._id}`} className="text-sm text-gray-600">
                  Rental Duration (Days):
                </label>
                <input
                  id={`duration-${car._id}`}
                  type="number"
                  min="1"
                  value={car.rentalDuration}
                  onChange={(e) => handleDurationChange(car._id, Number(e.target.value))}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="flex flex-col items-center mt-6">
          <p className="text-xl font-semibold text-gray-700">
            Total Price: ${totalPrice.toFixed(2)}
          </p>

          <Link
            href={{
              pathname: "/payment",
              query: {
                cart: JSON.stringify(cart),
                totalPrice: totalPrice.toFixed(2),
              },
            }}
          >
            <button className="bg-blue-500 text-white px-6 py-3 mt-4 rounded">
              Rent Now
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
