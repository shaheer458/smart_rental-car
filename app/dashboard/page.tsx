"use client";
import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";

// Sidebar Component
const Sidebar = ({ onLogout, setActiveSection }: { onLogout: () => void, setActiveSection: (section: string) => void }) => (
  <div className="w-full bg-gray-800 text-white p-4 fixed top-0 left-0 z-50 sm:relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <h2 className="text-2xl text-center sm:text-left">Admin Panel</h2>
    <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
      {["dashboard", "bookings", "cars"].map((section) => (
        <li key={section}>
          <button onClick={() => setActiveSection(section)} className="text-white text-lg">{section.charAt(0).toUpperCase() + section.slice(1)}</button>
        </li>
      ))}
      <li>
        <button onClick={onLogout} className="bg-red-500 text-white py-2 px-6 rounded w-full sm:w-auto">Logout</button>
      </li>
    </ul>
  </div>
);

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dailyBookings, setDailyBookings] = useState(0);
  const [loadingBookings, setLoadingBookings] = useState(true);
  
  const [carData, setCarData] = useState({
    name: "",
    brand: "",
    type: "",
    image_url: "",
    fuelCapacity: "Not specified",
    transmission: "",
    seatingCapacity: "",
    pricePerDay: 0,
    originalPrice: 0,
    tags: [],
    image: null,
  });
  const fetchDailyBookings = async () => {
    try {
      setLoadingBookings(true);
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  
      // Query Sanity for bookings made today
      const query = `*[_type == 'booking' && bookingDate >= '${today}T00:00:00' && bookingDate <= '${today}T23:59:59']{email}`;
      const bookings = await client.fetch(query);
  
      // Count unique users based on email
      const uniqueUsers = new Set(bookings.map((b : any) => b.email));
      setDailyBookings(uniqueUsers.size);
  
      setLoadingBookings(false);
    } catch (error) {
      console.error("Error fetching daily bookings:", error);
      setLoadingBookings(false);
    }
  };
  
  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    contact: "",
    location: "",
    paymentMethod: "",
    paymentOption: "",
    paymentNumber: "",
    carData: [],
    totalPrice: 0,
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (isAdmin !== "true") {
      window.location.href = "/login";
    } else {
      setIsAuthenticated(true);
      fetchBookings();
      fetchCars();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const query = "*[_type == 'booking']";
      const data = await client.fetch(query);
      setBookings(data.reverse());
      setLoadingBookings(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoadingBookings(false);
    }
  };

  const fetchCars = async () => {
    try {
      setLoadingCars(true);
      const query = "*[_type == 'carDataTypes']";
      const data = await client.fetch(query);
      setCars(data.reverse());
      setLoadingCars(false);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setLoadingCars(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/login";
  };

  const handleBookingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCarInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCarData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCar = await client.create({
        _type: "carDataTypes",
        name: carData.name,
        brand: carData.brand,
        type: carData.type,
        image_url: carData.image_url,
        fuelCapacity: carData.fuelCapacity,
        transmission: carData.transmission,
        seatingCapacity: carData.seatingCapacity,
        pricePerDay: carData.pricePerDay,
        originalPrice: carData.originalPrice,
        tags: carData.tags,
        image: carData.image,
      });
      setCars([newCar, ...cars]);
      setCarData({
        name: "",
        brand: "",
        type: "",
        image_url: "",
        fuelCapacity: "Not specified",
        transmission: "",
        seatingCapacity: "",
        pricePerDay: 0,
        originalPrice: 0,
        tags: [],
        image: null,
      });
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newBooking = await client.create({
        _type: "booking",
        fullName: bookingData.fullName,
        email: bookingData.email,
        contact: bookingData.contact,
        location: bookingData.location,
        paymentMethod: bookingData.paymentMethod,
        paymentOption: bookingData.paymentOption,
        paymentNumber: bookingData.paymentNumber,
        carData: bookingData.carData,
        totalPrice: bookingData.totalPrice,
      });
      setBookings([newBooking, ...bookings]);
      setBookingData({
        fullName: "",
        email: "",
        contact: "",
        location: "",
        paymentMethod: "",
        paymentOption: "",
        paymentNumber: "",
        carData: [],
        totalPrice: 0,
      });
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  const handleCarEdit = (carId: string) => {
    window.location.href = `/edit-car/${carId}`;  // Directly change the URL for redirection
  };
  

  const handleCarDelete = async (carId: string) => {
    try {
      await client.delete(carId);
      setCars(cars.filter((car) => car._id !== carId));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (isAdmin !== "true") {
      window.location.href = "/login";
    } else {
      setIsAuthenticated(true);
      fetchBookings();
      fetchCars();
      fetchDailyBookings(); // Fetch daily bookings
    }
  }, []);
  
  const handleBookingDelete = async (bookingId: string) => {
    try {
      await client.delete(bookingId);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return isAuthenticated ? (
    <div className="pt-24 px-4 sm:px-8 w-full">
      <Sidebar onLogout={handleLogout} setActiveSection={setActiveSection} />

      {activeSection === "dashboard" && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Todays Activity</h2>
          {loadingBookings ? <p>Loading...</p> : <p className="text-lg">Users Who Booked Today: {dailyBookings}</p>}
        </div>
      )}



      {/* Add New Car Section */}
      {activeSection === "cars" && (
        <>
        <h2 className="text-xl mb-4 mt-4">Add New Car</h2>
      <form onSubmit={handleCarSubmit} className="mb-6 space-y-4">
        <input
          type="text"
          name="name"
          value={carData.name}
          onChange={handleCarInputChange}
          placeholder="Car Name"
          className="border px-4 py-2 w-full"
        />
        <input
          type="text"
          name="brand"
          value={carData.brand}
          onChange={handleCarInputChange}
          placeholder="Car Brand"
          className="border px-4 py-2 w-full"
        />
        <input
          type="text"
          name="type"
          value={carData.type}
          onChange={handleCarInputChange}
          placeholder="Car Type"
          className="border px-4 py-2 w-full"
        />
        <input
          type="url"
          name="image_url"
          value={carData.image_url}
          onChange={handleCarInputChange}
          placeholder="Car Image URL"
          className="border px-4 py-2 w-full"
        />
        <input
          type="text"
          name="fuelCapacity"
          value={carData.fuelCapacity}
          onChange={handleCarInputChange}
          placeholder="Fuel Capacity"
          className="border px-4 py-2 w-full"
        />
        <input
          type="text"
          name="transmission"
          value={carData.transmission}
          onChange={handleCarInputChange}
          placeholder="Transmission"
          className="border px-4 py-2 w-full"
        />
        <input
          type="text"
          name="seatingCapacity"
          value={carData.seatingCapacity}
          onChange={handleCarInputChange}
          placeholder="Seating Capacity"
          className="border px-4 py-2 w-full"
        />
        <input
          type="string"
          name="pricePerDay"
          value={carData.pricePerDay}
          onChange={handleCarInputChange}
          placeholder="Price Per Day"
          className="border px-4 py-2 w-full"
        />
        <input
          type="string"
          name="originalPrice"
          value={carData.originalPrice}
          onChange={handleCarInputChange}
          placeholder="Original Price"
          className="border px-4 py-2 w-full"
        />
        <input
          type="text"
          name="tags"
          value={carData.tags.join(", ")}
          onChange={handleCarInputChange}
          placeholder="Tags (comma separated)"
          className="border px-4 py-2 w-full"
        />
        <input
          type="file"
          name="image"
          className="border px-4 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          Add Car
        </button>
      </form>

      {/* Car Data Table */}
      <h2 className="text-xl mb-4 mt-4">Car Data</h2>
      {loadingCars ? (
        <div>Loading cars...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border text-sm sm:text-base">
          <thead>
            <tr>
              <th className="border px-4 py-2">Car Name</th>
              <th className="border px-4 py-2">Brand</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Fuel Capacity</th>
              <th className="border px-4 py-2">Transmission</th>
              <th className="border px-4 py-2">Seating Capacity</th>
              <th className="border px-4 py-2">Price Per Day</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id}>
                <td className="border px-4 py-2">{car.name}</td>
                <td className="border px-4 py-2">{car.brand}</td>
                <td className="border px-4 py-2">{car.type}</td>
                <td className="border px-4 py-2">{car.fuelCapacity}</td>
                <td className="border px-4 py-2">{car.transmission}</td>
                <td className="border px-4 py-2">{car.seatingCapacity}</td>
                <td className="border px-4 py-2">{car.pricePerDay}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleCarEdit(car._id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCarDelete(car._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
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
        </>
      )}

      {/* Booking Data Table */}
      {activeSection === "bookings" && (
        <>
        <h2 className="text-xl mb-4 mt-4">Bookings</h2>
{loadingBookings ? (
  <div>Loading bookings...</div>
) : (
  <div className="overflow-x-auto">
    <table className="table-auto w-full border-collapse border text-sm sm:text-base">
    <thead>
      <tr>
        <th className="border px-4 py-2">Name</th>
        <th className="border px-4 py-2">E-mail</th>
        <th className="border px-4 py-2">Contact</th>
        <th className="border px-4 py-2">Location</th>
        <th className="border px-4 py-2">Payment Method</th>
        <th className="border px-4 py-2">Payment Option</th>
        <th className="border px-4 py-2">Payment Number</th>
        <th className="border px-4 py-2">Car Details</th>
        <th className="border px-4 py-2">Total Price</th>
        <th className="border px-4 py-2">Start Date</th>
        <th className="border px-4 py-2">End Date</th>
        <th className="border px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {bookings.map((booking) => (
        <tr key={booking._id}>
          <td className="border px-4 py-2">{booking.name}</td>
          <td className="border px-4 py-2">{booking.email}</td>
          <td className="border px-4 py-2">{booking.contact}</td>
          <td className="border px-4 py-2">{booking.location}</td>
          <td className="border px-4 py-2">{booking.paymentMethod}</td>
          <td className="border px-4 py-2">{booking.paymentOption}</td>
          <td className="border px-4 py-2">{booking.paymentNumber}</td>
          
          {/* Car Details Column */}
          <td className="border px-4 py-2">
            {Array.isArray(booking.carDetails) && booking.carDetails.length > 0 ? (
              booking.carDetails.map((car : any, index : any) => (
                <div key={index}>
                  {car.name} - {car.fuelCapacity} - {car.transmission} - {car.seatingCapacity}
                </div>
              ))
            ) : (
              <span>No car data available</span>
            )}
          </td>
          
          <td className="border px-4 py-2">${booking.totalPrice}</td>
          <td className="border px-4 py-2">{booking.startDate}</td>
          <td className="border px-4 py-2">{booking.endDate}</td>
          <td className="border px-4 py-2">
            <button
              onClick={() => handleBookingDelete(booking._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
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
        </>
      )}

    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Dashboard;
