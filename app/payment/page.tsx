
"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
// import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

// Load Stripe.js instance (COMMENTED OUT)
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

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

const CheckoutForm = ({ totalPrice, cart, userData, setUserData }: { totalPrice: string, cart: Car[], userData: any, setUserData: any }) => {
  // const stripe = useStripe();
  // const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prevState: any) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Step 1: Store Booking Data in Sanity
      const bookingData = {
        _type: "booking",
        name: userData.name,
        email: userData.email,
        contact: userData.contact,
        location: userData.location,
        paymentMethod: userData.paymentMethod,
        startDate: userData.startDate,
        endDate: userData.endDate,
        totalPrice: parseFloat(totalPrice),
        carDetails: cart.map((car) => ({
          name: car.name,
          fuelCapacity: car.fuelCapacity,
          transmission: car.transmission,
          seatingCapacity: car.seatingCapacity,
        })),
      };

      console.log("📤 Sending Booking Data to Sanity:", bookingData);
      await client.create(bookingData);
      console.log("✅ Booking Successfully Stored in Sanity");

      setSuccessMessage(`Thank you! Your booking has been confirmed.`);

      // Redirect to payment2 page
      setTimeout(() => {
        window.location.href = "/payment2";
      }, 2000);
    } catch (error: any) {
      console.error("❌ Error Storing Booking in Sanity:", error);
      setErrorMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="name" placeholder="Your Name" value={userData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded" />
      <input type="email" name="email" placeholder="Email Address" value={userData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded" />
      <input type="text" name="contact" placeholder="Contact Number" value={userData.contact} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded" />
      <select name="location" value={userData.location} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded">
        <option value="">Select Location</option>
        <option value="Nawabshah">Nawabshah</option>
        <option value="Sakrand">Sakrand</option>
        <option value="Saeedabad">Saeedabad</option>
        <option value="Hala">Hala</option>
        <option value="Hyderabad">Hyderabad</option>
        <option value="Karachi">Karachi</option>
      </select>

      <label htmlFor="startDate" className="text-gray-700">Rental Start Date</label>
      <input type="date" id="startDate" name="startDate" value={userData.startDate} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded" />
      
      <div className="space-y-4 mb-6">
        {cart.map((car) => (
          <div key={car._id} className="border p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mt-2">{car.name}</h3>
            <p className="text-gray-500">Price Per Day: {car.pricePerDay}</p>
            <p className="text-gray-500">Fuel Capacity: {car.fuelCapacity}</p>
            <p className="text-gray-500">Transmission: {car.transmission}</p>
            <p className="text-gray-500">Seating Capacity: {car.seatingCapacity}</p>
            <p className="text-gray-500">Rental Duration: {car.rentalDuration} days</p>
          </div>
        ))}
      </div>

      {/* <PaymentElement /> (COMMENTED OUT) */}

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

      <div className="flex justify-between items-center mt-4">
        <p className="text-xl font-semibold text-gray-700">Total Price: ${totalPrice}</p>
      </div>
      <button type="submit" disabled={loading} className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50">
        {!loading ? `Submit Booking` : "Processing..."}
      </button>
    </form>
  );
};

const Payment = () => {
  const searchParams = useSearchParams();
  const initialCart = JSON.parse(searchParams.get("cart") || "[]") as Car[];
  const initialTotalPrice = searchParams.get("totalPrice") || "0";

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    paymentMethod: "online",
    startDate: "",
    endDate: "",
    rentalDuration: 1,
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Booking Form</h2>
      {/* <Elements stripe={stripePromise} options={{ clientSecret }}> (COMMENTED OUT) */}
        <CheckoutForm totalPrice={initialTotalPrice} cart={initialCart} userData={userData} setUserData={setUserData} />
      {/* </Elements> */}
    </div>
  );
};

export default Payment;