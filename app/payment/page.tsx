'use client';

import { useState } from 'react';
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
  const [message, setMessage] = useState(''); // To display success/error messages

  const carPrices = {
    sedan: 50,
    suv: 75,
    convertible: 100,
    pickup: 60,
  };

  const calculateTotal = () => {
    if (carModel && rentalDuration > 0) {
      const pricePerDay = carPrices[carModel];
      setTotalCost(pricePerDay * rentalDuration);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Define payment details based on selected payment method
    let paymentDetails = {};
    if (paymentMethod === 'creditCard') {
      paymentDetails = { creditCardDetails: { cardNumber: creditCard, expiryDate, cvv } };
    } else if (paymentMethod === 'jazzCash') {
      paymentDetails = { jazzCashDetails };
    } else if (paymentMethod === 'easypaisa') {
      paymentDetails = { easyPaisaDetails };
    }

    const bookingData = {
      fullName,
      email,
      phone,
      carModel,
      rentalDuration,
      paymentMethod,
      totalCost,
      ...paymentDetails, // Spread the payment details based on the selected method
    };

    try {
      // Send booking data to Sanity
      const result = await client.create({
        _type: 'booking',
        ...bookingData,
      });
      setMessage('Booking successful!'); // Show success message
      console.log('Booking submitted:', result);

      // Reset form fields after submission
      setFullName('');
      setEmail('');
      setPhone('');
      setCarModel('');
      setRentalDuration(1);
      setCreditCard('');
      setExpiryDate('');
      setCvv('');
      setPaymentMethod('');
      setJazzCashDetails('');
      setEasyPaisaDetails('');
      setTotalCost(0);
    } catch (error) {
      setMessage('Error submitting booking. Please try again later.'); // Show error message
      console.error('Error submitting booking:', error);
    }
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
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="convertible">Convertible</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Rental Duration (Days)</label>
              <input
                type="number"
                value={rentalDuration}
                onChange={(e) => setRentalDuration(e.target.value)}
                min="1"
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Payment Method</h2>
          <div className="space-y-4">
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
          {paymentMethod === 'jazzcash' && (
            <div className="mt-4">
              <label className="block text-gray-700">JazzCash Mobile Number</label>
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
            <div className="mt-4">
              <label className="block text-gray-700">EasyPaisa Account Number</label>
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

        {/* Total Cost */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Total Cost: ${totalCost.toFixed(2)}</h3>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          Proceed to Payment
        </button>
      </form>

      {/* Show success or error message */}
      {message && <p className="mt-4 text-center text-lg">{message}</p>}
    </div>
  );
};

export default CarRentalPayment;
