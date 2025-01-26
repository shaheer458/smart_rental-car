'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client'; // Import the Sanity client

const CarRentalPayment = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState<'sedan' | 'suv' | 'convertible' | 'pickup' | 'diesel' | 'electric' | 'gasoline' | 'hatchback' | 'hybrid' | 'sport' | ''>('');
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

  const carPrices: { [key in 'sedan' | 'suv' | 'convertible' | 'pickup' | 'diesel' | 'electric' | 'gasoline' | 'hatchback' | 'hybrid' | 'sport']: number } = {
    sedan: 50,
    suv: 75,
    convertible: 100,
    pickup: 60,
    diesel: 80,
    electric: 90,
    gasoline: 100,
    hatchback: 70,
    hybrid: 110,
    sport: 120,
  };

  // Calculate total based on selected car model and rental duration
  useEffect(() => {
    if (carModel && rentalDuration > 0) {
      const pricePerDay = carPrices[carModel as 'sedan' | 'suv' | 'convertible' | 'pickup' | 'diesel' | 'electric' | 'gasoline' | 'hatchback' | 'hybrid' | 'sport'];
      setTotalCost(pricePerDay * rentalDuration);
    } else {
      setTotalCost(0);
    }
  }, [carModel, rentalDuration]);

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
    if (!fullName || !email || !phone || !carModel || !rentalStartDate || !rentalEndDate || rentalDuration <= 0 || !paymentMethod) {
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
                onChange={(e) => setCarModel(e.target.value as 'sedan' | 'suv' | 'convertible' | 'pickup' | 'diesel' | 'electric' | 'gasoline' | 'hatchback' | 'hybrid' | 'sport')}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">--Select a Car--</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="convertible">Convertible</option>
                <option value="pickup">Pickup</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="gasoline">Gasoline</option>
                <option value="hatchback">Hatchback</option>
                <option value="hybrid">Hybrid</option>
                <option value="sport">Sport</option>
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
            <div>
              <p className="text-gray-700">Price per day: ${carPrices[carModel as 'sedan' | 'suv' | 'convertible' | 'pickup' | 'diesel' | 'electric' | 'gasoline' | 'hatchback' | 'hybrid' | 'sport']}</p>
            </div>
          </div>
        </div>

        {/* Rental Date Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rental Dates</h2>
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
          </div>
        </div>

        {/* Total Cost */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Total Cost: ${totalCost.toFixed(2)}</h3>
        </div>

        {/* Payment Method Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Payment Method</h2>
          <div className="space-y-4">
            <div>
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === 'creditCard'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="creditCard" className="text-gray-700">Credit Card</label>
            </div>
            <div>
              <input
                type="radio"
                id="jazzcash"
                name="paymentMethod"
                value="jazzcash"
                checked={paymentMethod === 'jazzcash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="jazzcash" className="text-gray-700">JazzCash</label>
            </div>
            <div>
              <input
                type="radio"
                id="easypaisa"
                name="paymentMethod"
                value="easypaisa"
                checked={paymentMethod === 'easypaisa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="easypaisa" className="text-gray-700">EasyPaisa</label>
            </div>
          </div>

          {/* Show Payment Details Based on Selected Method */}
          {paymentMethod === 'creditCard' && (
            <div>
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

          {/* Other Payment Methods */}
          {paymentMethod === 'jazzcash' && (
            <div>
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
            </div>
          )}

          {paymentMethod === 'easypaisa' && (
            <div>
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
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg">
            Submit Booking
          </button>
        </div>
      </form>

      {/* Message */}
      {message && (
        <div className="mt-6 text-center text-lg text-gray-700">
          {message}
        </div>
      )}
    </div>
  );
};

export default CarRentalPayment;
