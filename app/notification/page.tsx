'use client';

import React, { useEffect, useState } from 'react';

export default function NotificationPage() {
  const [formData, setFormData] = useState<any | null>(null); // Store form data
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    try {
      // Retrieve form data from localStorage
      const storedData = localStorage.getItem('formData');

      // If the data exists in localStorage, parse and set it
      if (storedData) {
        setFormData(JSON.parse(storedData));
      } else {
        setError('No booking data found.'); // Handle case where no data exists
      }
    } catch (e) {
      setError('Failed to load booking data. Please try again later.'); // Handle parsing errors
    }
  }, []);

  // Display error or loading states
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!formData) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="w-full p-6 bg-[#f6f7f9] font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold mb-6">Booking Confirmation</h1>

      {/* Booking Details Table */}
      <table className="w-full table-auto bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th scope="col" className="py-2 px-4 text-left border-b">Field</th>
            <th scope="col" className="py-2 px-4 text-left border-b">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(formData).map(([key, value]) => (
            <tr key={key}>
              <td className="py-2 px-4 border-b font-semibold capitalize">
                {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </td>
              <td className="py-2 px-4 border-b">{value || 'Not Provided'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Go Back Button */}
      <div className="mt-6">
        <button
          onClick={() => window.location.href = '/'}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg"
        >
          Go Back to Homepage
        </button>
      </div>
    </div>
  );
}
