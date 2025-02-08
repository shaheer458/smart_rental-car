"use client";
import Link from "next/link";
import { useEffect } from "react";

const PaymentSuccess = () => {

  useEffect(() => {
    // Optionally, you can clear any stored cart data from local storage here
    localStorage.removeItem("cart");
    localStorage.removeItem("totalPrice");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <div className="text-center p-10 text-green-500 text-2xl font-bold">
      ✅ Payment Successful! Your car is booked.
    </div>
        <div className="mt-6">
          <Link href="/">
            <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
