'use client';

import React, { useEffect, useState } from 'react';

export default function NotificationPage() {
  const [formData, setFormData] = useState<any | null>(null); // Store form data
  const [error, setError] = useState<string | null>(null); // Error state
  const [loading, setLoading] = useState<boolean>(true); // Loading state for async tasks

  useEffect(() => {
    const fetchData = () => {
      try {
        // Retrieve form data from localStorage
        const storedData = localStorage.getItem('formData');

        // If the data exists in localStorage, parse and set it
        if (storedData) {
          setFormData(JSON.parse(storedData));
        } else {
          setError('No booking data found. Please make sure you have submitted a booking.');
        }
      } catch (e) {
        setError('Failed to load booking data. Please try again later.');
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchData();
  }, []);

  // Display error, loading, or the form data
  if (loading) {
    return <div className="text-center text-gray-500">Loading your booking details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!formData) {
    return <div className="text-center text-gray-500">No booking details available.</div>;
  }

  return (
    <div className="w-full p-6 bg-[#f6f7f9] font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-2xl font-bold mb-6 text-center">Booking Confirmation</h1>

      {/* Booking Details Table */}
      <table className="w-full table-auto bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead>
          <tr>
            <th scope="col" className="py-2 px-4 text-left border-b bg-gray-100">Field</th>
            <th scope="col" className="py-2 px-4 text-left border-b bg-gray-100">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(formData).map(([key, value]) => (
            <tr key={key}>
              <td className="py-2 px-4 border-b font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</td>
              <td className="py-2 px-4 border-b">{value || 'Not Provided'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Go Back Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.href = '/'}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Go Back to Homepage
        </button>
      </div>
    </div>
  );
}
