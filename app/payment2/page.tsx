"use client";

import { useEffect, useState } from "react";
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: "2024-02-08",
});

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Home() {
  const [booking, setBooking] = useState<{ name: string; totalPrice: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      const data = await client.fetch(
        `*[_type == "booking"] | order(_createdAt desc)[0] { name, totalPrice }`
      );
      setBooking(data);
    };

    fetchBooking();
  }, []);

  if (!booking) {
    return <p className="text-white text-center p-10">Loading...</p>;
  }

  const handleConfirmBooking = () => {
    if (paymentMethod === "cash") {
      setIsConfirmed(true);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-slate-400 to-zinc-900">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">{booking.name}</h1>
        <h2 className="text-2xl">
          has requested
          <span className="font-bold"> ${booking.totalPrice}</span>
        </h2>
      </div>

      {!isConfirmed && !paymentSuccess ? (
        <>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Select Payment Method:
            </label>
            <select
              className="p-2 rounded-md bg-gray-800 text-white w-full max-w-xs"
              value={paymentMethod || ""}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="" disabled>
                Choose an option
              </option>
              <option value="cash">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>
          </div>

          {paymentMethod === "cash" && (
            <button
              onClick={handleConfirmBooking}
              className="px-6 py-3 bg-green-500 rounded-md text-white font-bold hover:bg-green-600"
            >
              Confirm Booking
            </button>
          )}

          {paymentMethod === "online" && (
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubcurrency(booking.totalPrice),
                currency: "usd",
              }}
            >
              <CheckoutPage amount={booking.totalPrice} onSuccess={() => setPaymentSuccess(true)} />
            </Elements>
          )}
        </>
      ) : (
        <div className="text-xl font-semibold text-green-400">
          ✅ {paymentMethod === "cash" ? "Your car is booked with Cash on Delivery!" : "Payment Successful! Your car is booked."}
        </div>
      )}
    </main>
  );
}
