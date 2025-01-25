// schemas/booking.js
export default {
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    { name: 'fullName', title: 'Full Name', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'carModel', title: 'Car Model', type: 'string' },
    { name: 'rentalDuration', title: 'Rental Duration', type: 'number' },
    { name: 'paymentMethod', title: 'Payment Method', type: 'string' },
    { name: 'totalCost', title: 'Total Cost', type: 'number' },
    { name: 'creditCardDetails', title: 'Credit Card Details', type: 'object', fields: [
      { name: 'cardNumber', title: 'Card Number', type: 'string' },
      { name: 'expiryDate', title: 'Expiry Date', type: 'string' },
      { name: 'cvv', title: 'CVV', type: 'string' },
    ]},
    { name: 'paymentDetails', title: 'Payment Details', type: 'object', fields: [
      { name: 'jazzCashDetails', title: 'JazzCash Details', type: 'string' },
      { name: 'easyPaisaDetails', title: 'EasyPaisa Details', type: 'string' },
    ]},
  ],
};
