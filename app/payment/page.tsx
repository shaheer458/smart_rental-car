'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';

interface Car {
  _id: string;
  name: string;
  pricePerDay: string;
  image_url: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: string;
  rentalDuration: number;
}

const Payment = () => {
  const searchParams = useSearchParams();
  const initialCart = JSON.parse(searchParams.get('cart') || '[]') as Car[];
  const initialTotalPrice = searchParams.get('totalPrice') || '0';

  const [cart, setCart] = useState<Car[]>(initialCart); // State for cart items
  const [totalPrice, setTotalPrice] = useState<string>(initialTotalPrice); // State for total price

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contact: '',
    location: '',
    paymentMethod: 'online',
    paymentOption: '',
    paymentNumber: '',
    startDate: '', // Added startDate
    endDate: '',   // Added endDate
    rentalDuration: 1, // Set a default rental duration
  });

  const [loading, setLoading] = useState(false); // Loading state for submit button

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value;
    const rentalDuration = userData.rentalDuration;

    setUserData((prevState) => ({
      ...prevState,
      startDate,
      endDate: calculateEndDate(startDate, rentalDuration),
    }));
  };

  const calculateEndDate = (startDate: string, rentalDuration: number): string => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + rentalDuration); // Adding rental duration to start date
    return start.toISOString().split('T')[0]; // Format it back to a date string (YYYY-MM-DD)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload on form submit
    setLoading(true); // Set loading state to true while submitting

    if (userData.paymentMethod === 'offline' || (userData.paymentMethod === 'online' && userData.paymentOption && userData.paymentNumber)) {
      const bookingData = {
        name: userData.name,
        email: userData.email,
        contact: userData.contact,
        location: userData.location,
        paymentMethod: userData.paymentMethod,
        paymentOption: userData.paymentOption,
        paymentNumber: userData.paymentNumber,
        startDate: userData.startDate,
        endDate: userData.endDate,
        carDetails: cart.map((car) => ({
          name: car.name,
          fuelCapacity: car.fuelCapacity,
          transmission: car.transmission,
          seatingCapacity: car.seatingCapacity,
        })),
        totalPrice: parseFloat(totalPrice),
      };

      try {
        // Save the booking data to Sanity
        await client.create({
          _type: 'booking',
          ...bookingData,
        });

        alert('Booking submitted successfully!');
        
        // Reset state after successful submission
        setUserData({
          name: '',
          email: '',
          contact: '',
          location: '',
          paymentMethod: 'online',
          paymentOption: '',
          paymentNumber: '',
          startDate: '',
          endDate: '',
          rentalDuration: 1, // Reset rental duration to default value
        });
        setCart([]); // Clear the cart
        setTotalPrice('0'); // Reset the total price
      } catch (error) {
        alert('There was an error submitting your booking.');
      } finally {
        setLoading(false); // Reset loading state after submission attempt
      }
    } else {
      alert('Please complete the payment details.');
      setLoading(false); // Reset loading state if validation fails
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Booking Form</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Information Fields */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={userData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={userData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={userData.contact}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded"
        />
        <select
          name="location"
          value={userData.location}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded"
        >
          <option value="">Select Location</option>
          <option value="Nawabshah">Nawabshah</option>
          <option value="Sakrand">Sakrand</option>
          <option value="Saeedabad">Saeedabad</option>
          <option value="Hala">Hala</option>
          <option value="Hyderabad">Hyderabad</option>
        </select>

        {/* Payment Method Radio Buttons */}
        <div className="flex space-x-4">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={userData.paymentMethod === 'online'}
              onChange={handleChange}
            />
            Online Payment
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="offline"
              checked={userData.paymentMethod === 'offline'}
              onChange={handleChange}
            />
            C.O.D Payment
          </label>
        </div>

        {/* Online Payment Options */}
        {userData.paymentMethod === 'online' && (
          <>
            <select
              name="paymentOption"
              value={userData.paymentOption}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="">Select Payment Method</option>
              <option value="easypaisa">Easypaisa</option>
              <option value="jazzcash">JazzCash</option>
            </select>
            {userData.paymentOption && (
              <input
                type="text"
                name="paymentNumber"
                placeholder="Enter Payment Number"
                value={userData.paymentNumber}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded"
              />
            )}
          </>
        )}

        {/* Rental Start Date */}
        <label htmlFor="startDate">Rental Start Date</label>
        <input
          type="date"
          name="startDate"
          value={userData.startDate}
          onChange={handleStartDateChange}
          required
          className="w-full p-3 border border-gray-300 rounded"
        />

        {/* Rental End Date (Automatically set) */}
        <label htmlFor="endDate">Rental End Date</label>
        <input
          type="date"
          name="endDate"
          value={userData.endDate}
          readOnly
          className="w-full p-3 border border-gray-300 rounded bg-gray-200"
        />

        {/* Cart Items Display */}
        <div className="mt-4">
          {cart.map((car: Car) => (
            <div key={car._id} className="border rounded-lg p-4 mb-4">
              <Image
                src={car.image_url}
                alt={car.name}
                width={500}
                height={300}
                className="w-32 h-auto object-cover rounded-lg"
              />
              <h3 className="text-lg font-semibold mt-4">{car.name}</h3>
              <p className="text-sm text-gray-600">Price per Day: {car.pricePerDay}</p>
              <p className="text-sm text-gray-600">Rental Duration: {car.rentalDuration} Days</p>
              <p className="text-sm text-gray-600">
                Total Price for {car.rentalDuration} days: $
                {parseFloat(car.pricePerDay.replace(/[^\d.-]/g, '')) * car.rentalDuration}
              </p>
              <p className="text-sm text-gray-600">Fuel Capacity: {car.fuelCapacity}</p>
              <p className="text-sm text-gray-600">Transmission: {car.transmission}</p>
              <p className="text-sm text-gray-600">Seating Capacity: {car.seatingCapacity}</p>
            </div>
          ))}
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-semibold text-gray-700">Total Price: ${totalPrice}</p>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
