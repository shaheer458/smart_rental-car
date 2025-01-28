'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client'; // Import the Sanity client

const CarRentalPayment = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [rentalDuration, setRentalDuration] = useState(1);
  const [creditCard, setCreditCard] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [jazzCashDetails, setJazzCashDetails] = useState('');
  const [easyPaisaDetails, setEasyPaisaDetails] = useState('');
  const [message, setMessage] = useState('');
  const [rentalStartDate, setRentalStartDate] = useState<string>('');
  const [rentalEndDate, setRentalEndDate] = useState<string>('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [paymentType, setPaymentType] = useState(''); // Payment type (online or offline)
  const [carData, setCarData] = useState<{ name: string; pricePerDay: number }[]>([]);

  useEffect(() => {
    const fetchCarData = async () => {
      const query = `*[_type == "carDataTypes"]{ name, pricePerDay }`;
      const cars = await client.fetch(query);
      setCarData(cars);
    };
    fetchCarData();
  }, []);

  // Calculate total cost based on selected car model and rental duration
  useEffect(() => {
    const selectedCar = carData.find((car) => car.name === carModel);
    if (selectedCar && rentalDuration > 0) {
      setTotalCost(selectedCar.pricePerDay * rentalDuration);
    } else {
      setTotalCost(0); // If no car is selected, set total cost to 0
    }
  }, [carModel, rentalDuration, carData]);

  // Check car availability before booking
  const checkCarAvailability = async (carModel: string, rentalStartDate: string, rentalEndDate: string) => {
    const query = `*[_type == "booking" && carModel == $carModel && rentalStartDate <= $rentalEndDate && rentalEndDate >= $rentalStartDate]`;
    const params = { carModel, rentalStartDate, rentalEndDate };
    const existingBookings = await client.fetch(query, params);

    return existingBookings.length === 0; // If no bookings exist for the given date range, the car is available
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validate form
    if (!fullName || !email || !phone || !carModel || !rentalStartDate || !rentalEndDate || rentalDuration <= 0 || !pickupLocation || !pickupTime) {
      setMessage('Please fill in all required fields.');
      return;
    }

    // Check if the car is available
    const isCarAvailable = await checkCarAvailability(carModel, rentalStartDate, rentalEndDate);
    if (!isCarAvailable) {
      setMessage('The selected car is already booked for these dates. Please choose another car or adjust the rental period.');
      return;
    }

    // Prepare payment details based on the selected method
    let paymentDetails = {};

    if (paymentType === 'online') {
      if (!paymentMethod) {
        setMessage('Please select a payment method.');
        return;
      }

      if (paymentMethod === 'creditCard') {
        if (!creditCard || !expiryDate || !cvv) {
          setMessage('Please provide all credit card details.');
          return;
        }
        paymentDetails = { creditCardDetails: { cardNumber: creditCard, expiryDate, cvv } };
      } else if (paymentMethod === 'jazzcash') {
        if (!jazzCashDetails) {
          setMessage('Please provide your JazzCash details.');
          return;
        }
        paymentDetails = { jazzCashDetails };
      } else if (paymentMethod === 'easypaisa') {
        if (!easyPaisaDetails) {
          setMessage('Please provide your EasyPaisa details.');
          return;
        }
        paymentDetails = { easyPaisaDetails };
      }
    } else if (paymentType === 'offline') {
      // For offline payment, you don't need to gather payment details, just proceed
      paymentDetails = { paymentType: 'offline' };
    }

    const bookingData = {
      fullName,
      email,
      phone,
      carModel,
      rentalStartDate,
      rentalEndDate,
      rentalDuration,
      paymentMethod,
      totalCost,
      pickupLocation,
      pickupTime,
      ...paymentDetails,
    };

    try {
      const result = await client.create({
        _type: 'booking',
        ...bookingData,
      });
      setMessage('Booking successful!');
      console.log('Booking submitted:', result);

      // Reset form fields after submission
      setFullName('');
      setEmail('');
      setPhone('');
      setCarModel('');
      setRentalStartDate('');
      setRentalEndDate('');
      setRentalDuration(1);
      setCreditCard('');
      setExpiryDate('');
      setCvv('');
      setPaymentMethod('');
      setJazzCashDetails('');
      setEasyPaisaDetails('');
      setTotalCost(0);
      setPickupLocation('');
      setPickupTime('');
    } catch (error) {
      setMessage('Error submitting booking. Please try again later.');
      console.error('Error submitting booking:', error);
    }
  };

  // Update rental end date when rental start date or duration changes
  const handleRentalStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRentalStartDate(e.target.value);
    const startDate = new Date(e.target.value);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + rentalDuration);
    setRentalEndDate(endDate.toISOString().split('T')[0]);
  };

  const handleRentalDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = Number(e.target.value);
    setRentalDuration(duration);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Car Rental Payment</h1>
      <form onSubmit={handleSubmit}>
        {/* Customer Information Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Car Selection Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Your Car</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Car Model</label>
              <select
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">--Select a Car--</option>
                {carData.map((car) => (
                  <option key={car.name} value={car.name}>
                    {car.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Rental Duration (Days)</label>
              <input
                type="number"
                value={rentalDuration}
                onChange={handleRentalDurationChange}
                min="1"
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            {carModel && (
              <div>
                <p className="text-gray-700">Price per day: {carData.find((car) => car.name === carModel)?.pricePerDay}</p>
              </div>
            )}
          </div>
        </div>

        {/* Rental Date and Time Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rental Dates and Time</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700">Rental Start Date</label>
              <input
                type="date"
                value={rentalStartDate}
                onChange={handleRentalStartDateChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Rental End Date</label>
              <input
                type="date"
                value={rentalEndDate}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Pick-up Location</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Pick-up Time</label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Payment Type Selection */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Type</h2>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="">--Select Payment Type--</option>
            <option value="online">Online Payment</option>
            <option value="offline">Offline Payment</option>
          </select>
        </div>

        {/* Payment Method Section */}
        {paymentType === 'online' && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">--Select Payment Method--</option>
              <option value="creditCard">Credit Card</option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>

            {/* Payment Method Details */}
            {paymentMethod === 'creditCard' && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-gray-700">Credit Card Number</label>
                  <input
                    type="text"
                    value={creditCard}
                    onChange={(e) => setCreditCard(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
            {paymentMethod === 'jazzcash' && (
              <div>
                <label className="block text-gray-700">JazzCash Details</label>
                <input
                  type="text"
                  value={jazzCashDetails}
                  onChange={(e) => setJazzCashDetails(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            )}
            {paymentMethod === 'easypaisa' && (
              <div>
                <label className="block text-gray-700">EasyPaisa Details</label>
                <input
                  type="text"
                  value={easyPaisaDetails}
                  onChange={(e) => setEasyPaisaDetails(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="mb-6">
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg">
            Submit Booking
          </button>
        </div>

        {/* Error or Success Message */}
        {message && (
          <div className="text-center text-lg font-semibold text-red-500">{message}</div>
        )}
      </form>
    </div>
  );
};

export default CarRentalPayment;
