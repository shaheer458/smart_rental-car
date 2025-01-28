"use client";

import { client } from '@/sanity/lib/client';
import React, { useEffect, useState } from 'react';

const Sidebar = ({ onLogout }: { onLogout: () => void }) => (
  <div>
    <div className="w-full bg-gray-800 text-white p-4 top-[110px] left-0 z-50 h-auto sm:h-24 sm:flex sm:flex-row sm:space-x-6">
      <h2 className="text-xl sm:text-2xl sm:mt-0 mt-4 text-center sm:text-left">Admin Panel</h2>
      <ul className="sm:flex sm:space-x-6 sm:mt-2 space-y-4 sm:items-center">
        <li>
          <a href="/dashboard" className="text-white text-center sm:text-left">Dashboard</a>
        </li>
        <li>
          <a href="/dashboard" className="text-white block text-center sm:text-left">Bookings</a>
        </li>
        <li>
          <a href="/dashboard" className="text-white block text-center sm:text-left">Car Data</a>
        </li>
        <li>
          <button onClick={onLogout} className="bg-red-500 text-white py-2 px-6 rounded block text-center sm:text-left">
            Logout
          </button>
        </li>
      </ul>
    </div>
  </div>
);

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingCars, setLoadingCars] = useState(true);
  const [isEditingCar, setIsEditingCar] = useState(false);
  const [editCarId, setEditCarId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    type: '',
    fuelCapacity: '',
    transmission: '',
    seatingCapacity: '',
    pricePerDay: '',
    originalPrice: '',
    tags: [],
    image: null,
  });

  const [bookingData, setBookingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    carModel: '',
    rentalDuration: '',
    rentalStartDate: '',
    rentalEndDate: '',
    paymentMethod: '',
    totalCost: '',
    pickupLocation: '',
    pickupTime: '',
    paymentType: '',
    creditCardDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
    paymentDetails: {
      jazzCashDetails: '',
      easyPaisaDetails: '',
    }
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    if (isAdmin !== 'true') {
      window.location.href = '/login';
    } else {
      setIsAuthenticated(true);
      fetchBookings();
      fetchCars();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const query = '*[_type == "booking"]';
      const data = await client.fetch(query);
      const filteredBookings = data.filter((booking: any) => {
        const startDate = new Date(booking.rentalStartDate);
        const today = new Date();
        return startDate >= today;
      });

      setBookings(filteredBookings);
      setLoadingBookings(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoadingBookings(false);
    }
  };

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      const query = '*[_type == "carDataTypes"]';
      const data = await client.fetch(query);
      setCars(data);
      setLoadingCars(false);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setLoadingCars(false);
    }
  };

  const handleCarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitCarData = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditingCar && editCarId) {
      try {
        await client.patch(editCarId).set({
          name: formData.name,
          brand: formData.brand,
          type: formData.type,
          fuelCapacity: formData.fuelCapacity,
          transmission: formData.transmission,
          seatingCapacity: formData.seatingCapacity,
          pricePerDay: formData.pricePerDay,
          originalPrice: formData.originalPrice,
          tags: formData.tags,
          image: formData.image,
        });
        fetchCars();
        setIsEditingCar(false);
        setEditCarId(null);
        clearForm();
      } catch (error) {
        console.error('Error updating car data:', error);
      }
    } else {
      try {
        await client.create({
          _type: 'carDataTypes',
          name: formData.name,
          brand: formData.brand,
          type: formData.type,
          fuelCapacity: formData.fuelCapacity,
          transmission: formData.transmission,
          seatingCapacity: formData.seatingCapacity,
          pricePerDay: formData.pricePerDay,
          originalPrice: formData.originalPrice,
          tags: formData.tags,
          image: formData.image,
        });
        fetchCars();
        clearForm();
      } catch (error) {
        console.error('Error creating car data:', error);
      }
    }
  };

  const handleSubmitBookingData = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await client.create({
        _type: 'booking',
        fullName: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        carModel: bookingData.carModel,
        rentalDuration: bookingData.rentalDuration,
        rentalStartDate: bookingData.rentalStartDate,
        rentalEndDate: bookingData.rentalEndDate,
        pickupLocation: bookingData.pickupLocation,
        pickupTime: bookingData.pickupTime,
        totalCost: bookingData.totalCost,
        paymentMethod: bookingData.paymentMethod,
        paymentType: bookingData.paymentType,
        creditCardDetails: bookingData.creditCardDetails,
        paymentDetails: bookingData.paymentDetails,
      });
      fetchBookings();
      clearBookingForm();
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      brand: '',
      type: '',
      fuelCapacity: '',
      transmission: '',
      seatingCapacity: '',
      pricePerDay: '',
      originalPrice: '',
      tags: [],
      image: null,
    });
  };

  const clearBookingForm = () => {
    setBookingData({
      fullName: '',
      email: '',
      phone: '',
      carModel: '',
      rentalDuration: '',
      rentalStartDate: '',
      rentalEndDate: '',
      paymentMethod: '',
      totalCost: '',
      pickupLocation: '',
      pickupTime: '',
      paymentType: '',
      creditCardDetails: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      },
      paymentDetails: {
        jazzCashDetails: '',
        easyPaisaDetails: '',
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.location.href = '/login';
  };

  return isAuthenticated ? (
    <div className="flex flex-col">
      <Sidebar onLogout={handleLogout} />

      <div className="pt-16 w-full p-6">
        <h1 className="text-3xl mb-4">Admin Dashboard</h1>

        {/* Bookings Section */}
        <h2 className="text-xl mb-4 mt-4">Bookings</h2>
        <form onSubmit={handleSubmitBookingData} className="mb-6 space-y-4">
          <input
            type="text"
            name="fullName"
            value={bookingData.fullName}
            onChange={handleBookingInputChange}
            placeholder="Full Name"
            className="border px-4 py-2 w-full"
          />
          <input
            type="email"
            name="email"
            value={bookingData.email}
            onChange={handleBookingInputChange}
            placeholder="Email"
            className="border px-4 py-2 w-full"
          />
          <input
            type="tel"
            name="phone"
            value={bookingData.phone}
            onChange={handleBookingInputChange}
            placeholder="Phone"
            className="border px-4 py-2 w-full"
          />
          <input
            type="text"
            name="carModel"
            value={bookingData.carModel}
            onChange={handleBookingInputChange}
            placeholder="Car Model"
            className="border px-4 py-2 w-full"
          />
          <input
            type="number"
            name="rentalDuration"
            value={bookingData.rentalDuration}
            onChange={handleBookingInputChange}
            placeholder="Rental Duration (days)"
            className="border px-4 py-2 w-full"
          />
          <input
            type="date"
            name="rentalStartDate"
            value={bookingData.rentalStartDate}
            onChange={handleBookingInputChange}
            className="border px-4 py-2 w-full"
          />
          <input
            type="date"
            name="rentalEndDate"
            value={bookingData.rentalEndDate}
            onChange={handleBookingInputChange}
            className="border px-4 py-2 w-full"
          />
          <input
            type="text"
            name="pickupLocation"
            value={bookingData.pickupLocation}
            onChange={handleBookingInputChange}
            placeholder="Pickup Location"
            className="border px-4 py-2 w-full"
          />
          <input
            type="time"
            name="pickupTime"
            value={bookingData.pickupTime}
            onChange={handleBookingInputChange}
            className="border px-4 py-2 w-full"
          />
          <input
            type="number"
            name="totalCost"
            value={bookingData.totalCost}
            onChange={handleBookingInputChange}
            placeholder="Total Cost"
            className="border px-4 py-2 w-full"
          />
          <input
            type="text"
            name="paymentMethod"
            value={bookingData.paymentMethod}
            onChange={handleBookingInputChange}
            placeholder="Payment Method"
            className="border px-4 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded"
          >
            Submit Booking
          </button>
        </form>

        {loadingBookings ? (
          <div>Loading bookings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Car Model</th>
                  <th className="border px-4 py-2">Rental Duration</th>
                  <th className="border px-4 py-2">Start Date</th>
                  <th className="border px-4 py-2">End Date</th>
                  <th className="border px-4 py-2">Pickup Location</th>
                  <th className="border px-4 py-2">Pickup Time</th>
                  <th className="border px-4 py-2">Total Cost</th>
                  <th className="border px-4 py-2">Payment Method</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: any) => (
                  <tr key={booking._id}>
                    <td className="border px-4 py-2">{booking.fullName}</td>
                    <td className="border px-4 py-2">{booking.email}</td>
                    <td className="border px-4 py-2">{booking.phone}</td>
                    <td className="border px-4 py-2">{booking.carModel}</td>
                    <td className="border px-4 py-2">{booking.rentalDuration}</td>
                    <td className="border px-4 py-2">{booking.rentalStartDate}</td>
                    <td className="border px-4 py-2">{booking.rentalEndDate}</td>
                    <td className="border px-4 py-2">{booking.pickupLocation}</td>
                    <td className="border px-4 py-2">{booking.pickupTime}</td>
                    <td className="border px-4 py-2">{booking.totalCost}</td>
                    <td className="border px-4 py-2">{booking.paymentType}</td>
                    <td className="border px-4 py-2">{booking.paymentMethod}</td>

                    <td className="border px-4 py-2">
                      <button
                        onClick={() => (booking._id)}
                        className="bg-red-500 text-white py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default Dashboard;
