export default {
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(100).error("Name is required and should be between 3 and 100 characters."),
    },
    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      validation: Rule => Rule.required().min(10).max(15).error("Phone number is required and should be between 10 and 15 characters."),
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(200).error("Address is required and should be between 5 and 200 characters."),
    },
    {
      name: 'city',
      title: 'Town/City',
      type: 'string',
      validation: Rule => Rule.required().min(2).max(100).error("City is required and should be between 2 and 100 characters."),
    },
    {
      name: 'rentalDate',
      title: 'Rental Date',
      type: 'datetime',
      validation: Rule => Rule.required().error("Rental date is required."),
    },
    {
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'datetime',
      validation: Rule => Rule.required().error("Expiry date is required."),
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Credit Card', value: 'creditCard' },
          { title: 'Debit Card', value: 'debitCard' },
          { title: 'JazzCash', value: 'jazzCash' },
          { title: 'EasyPaisa', value: 'easyPaisa' },
        ],
      },
      validation: Rule => Rule.required().error("Payment method is required."),
    },
    {
      name: 'cardNumber',
      title: 'Card Number',
      type: 'string',
      validation: Rule => Rule.required().min(13).max(19).error("Card number is required and should be between 13 and 19 digits."),
    },
    {
      name: 'cardHolder',
      title: 'Card Holder',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(100).error("Card holder name is required and should be between 3 and 100 characters."),
    },
    {
      name: 'expirationDate',
      title: 'Expiration Date',
      type: 'datetime',
      validation: Rule => Rule.required().error("Expiration date is required."),
    },
    {
      name: 'cvc',
      title: 'CVC',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(4).error("CVC is required and should be 3 or 4 digits."),
    },
    {
      name: 'carAvailability',
      title: 'Car Availability',
      type: 'boolean',
      initialValue: true,
      validation: Rule => Rule.required().error("Car availability status is required."),
    },
    {
      name: 'marketingConsent',
      title: 'Marketing Consent',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'termsConsent',
      title: 'Terms Consent',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'jazzCashNumber',
      title: 'JazzCash Phone Number',
      type: 'string',
      validation: Rule => Rule.min(10).max(15).error("JazzCash phone number is required and should be between 10 and 15 digits."),
      hidden: ({ parent }) => !(parent?.paymentMethod === 'jazzCash' || parent?.paymentMethod === 'easyPaisa'), // This field will only be shown if payment method is JazzCash or EasyPaisa
    },
  ],
};
