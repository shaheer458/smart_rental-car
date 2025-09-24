"use client"; // To indicate this component should be client-side only
import React, { useEffect, useState } from "react";

const Shipment = () => {
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Access sessionStorage only in the browser
      const storedData = sessionStorage.getItem("bookingData");
      if (storedData) {
        setBookingData(JSON.parse(storedData));
      }
    }
  }, []);

  if (!bookingData) {
    return <p>Loading...</p>; // You can show a loading state while the data is being fetched
  }

  const {
    name,
    email,
    contact,
    location,
    paymentMethod,
    paymentOption,
    paymentNumber,
    startDate,
    endDate,
    totalPrice,
    carDetails,
    orderStatus, // Assuming orderStatus will be in bookingData (e.g., 'pending', 'delivered', 'in-transit')
    carLocation, // car's current latitude/longitude
    userLocation, // user's current latitude/longitude
  } = bookingData;

  // Function to display the status of the car's journey
  const getStatusText = () => {
    switch (orderStatus) {
      case "pending":
        return "Order Pending";
      case "in-transit":
        return "Car is on it&apos;s way!";
      case "delivered":
        return "Car Delivered";
      default:
        return "Status Unknown";
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Shipment Details</h2>

      <div className="space-y-4">
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Contact:</strong> {contact}
        </p>
        <p>
          <strong>Location:</strong> {location}
        </p>
        <p>
          <strong>Payment Method:</strong> {paymentMethod}
        </p>
        {paymentMethod === "online" && (
          <>
            <p>
              <strong>Payment Option:</strong> {paymentOption}
            </p>
            <p>
              <strong>Payment Number:</strong> {paymentNumber}
            </p>
          </>
        )}
        <p>
          <strong>Rental Start Date:</strong> {startDate}
        </p>
        <p>
          <strong>Rental End Date:</strong> {endDate}
        </p>

        {/* Order Status Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Order Status:</h3>
          <p
            className={`text-xl font-bold ${
              orderStatus === "delivered"
                ? "text-green-600"
                : orderStatus === "in-transit"
                ? "text-blue-600"
                : "text-yellow-600"
            }`}
          >
            {getStatusText()}
          </p>
        </div>

        {/* Car Tracking */}
        {orderStatus === "in-transit" && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Tracking the Car</h3>
            <div className="space-y-2">
              <p>
                <strong>Car&apos;s Current Location:</strong> {carLocation.latitude}, {carLocation.longitude}
              </p>
              <p>
                <strong>Your Location:</strong> {userLocation.latitude}, {userLocation.longitude}
              </p>

              {/* Placeholder for map (e.g., use a map service to show the car's location) */}
              <div className="bg-gray-300 h-64 rounded-lg">
                {/* You could use a map API like Google Maps or Mapbox to show the map */}
                <p className="text-center mt-28 text-gray-600">
                  Map (Car&apos;s Location)
                </p>
              </div>
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-4">Car Details</h3>
        <div>
          {carDetails &&
            carDetails.map((car: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <p>
                  <strong>Car Name:</strong> {car.name}
                </p>
                <p>
                  <strong>Fuel Capacity:</strong> {car.fuelCapacity}
                </p>
                <p>
                  <strong>Transmission:</strong> {car.transmission}
                </p>
                <p>
                  <strong>Seating Capacity:</strong> {car.seatingCapacity}
                </p>
              </div>
            ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-xl font-semibold text-gray-700">
            Total Price: ${totalPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shipment;
