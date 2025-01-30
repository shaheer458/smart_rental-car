export default {
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string', // To capture the customer's name
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string', // To capture the customer's email
    },
    {
      name: 'contact',
      title: 'Contact Number',
      type: 'string', // To capture the customer's contact number
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      options: {
        list: [
          { title: 'Nawabshah', value: 'Nawabshah' },
          { title: 'Sakrand', value: 'Sakrand' },
          { title: 'Saeedabad', value: 'Saeedabad' },
          { title: 'Hala', value: 'Hala' },
          { title: 'Hyderabad', value: 'Hyderabad' },
        ], // The options that will be shown for location selection
      },
    },
    {
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
      options: {
        list: [
          { title: 'Online Payment', value: 'online' },
          { title: 'C.O.D Payment', value: 'offline' },
        ], // Options for payment method
      },
    },
    {
      name: 'paymentOption',
      title: 'Payment Option',
      type: 'string',
      options: {
        list: [
          { title: 'Easypaisa', value: 'easypaisa' },
          { title: 'JazzCash', value: 'jazzcash' },
        ], // Options for payment services under 'online' payment method
      },
      hidden: ({parent} : any) => parent?.paymentMethod !== 'online', // Only show if 'online' payment method is selected
    },
    {
      name: 'paymentNumber',
      title: 'Payment Number',
      type: 'string',
      hidden: ({parent} : any) => parent?.paymentMethod !== 'online' || !parent?.paymentOption, // Show only if paymentOption is selected
    },
    {
      name: 'carData',
      title: 'Car Data',
      type: 'array', // To store an array of selected cars
      of: [{ type: 'reference', to: [{ type: 'carDataTypes' }] }], // Reference to car data types (make sure 'carDataTypes' is defined)
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number', // To capture the total booking price
    },
  ],
};
