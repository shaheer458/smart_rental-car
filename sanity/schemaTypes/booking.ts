export default {
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    { name: 'fullName', title: 'Full Name', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'carModel', title: 'Car Model', type: 'string' },
    { name: 'rentalDuration', title: 'Rental Duration (Days)', type: 'number' },
    { name: 'rentalStartDate', title: 'Rental Start Date', type: 'date' },
    { name: 'rentalEndDate', title: 'Rental End Date', type: 'date' },
    { name: 'paymentMethod', title: 'Payment Method', type: 'string' },
    { name: 'totalCost', title: 'Total Cost', type: 'number' }, // Total cost field will be set based on the car rental price and duration

    // Credit Card Details (only for credit card payment method)
    {
      name: 'creditCardDetails',
      title: 'Credit Card Details',
      type: 'object',
      fields: [
        { name: 'cardNumber', title: 'Card Number', type: 'string' },
        { name: 'expiryDate', title: 'Expiry Date', type: 'string' },
        { name: 'cvv', title: 'CVV', type: 'string' },
      ],
    },

    // Payment Details (for JazzCash or EasyPaisa payment method)
    {
      name: 'paymentDetails',
      title: 'Payment Details',
      type: 'object',
      fields: [
        { name: 'jazzCashDetails', title: 'JazzCash Details', type: 'string' },
        { name: 'easyPaisaDetails', title: 'EasyPaisa Details', type: 'string' },
      ],
    },
  ],

  // Add a hook to handle the total cost calculation
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'carModel',
      date: 'rentalStartDate',
    },
    prepare(selection : any) {
      const { title, subtitle, date } = selection;
      return {
        title: `${title} - ${subtitle}`,
        subtitle: `${date ? new Date(date).toLocaleDateString() : ''}`,
      };
    },
  },
};
