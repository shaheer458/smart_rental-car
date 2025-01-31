export default {
  name: 'booking',
  title: 'Booking',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'contact',
      title: 'Contact Number',
      type: 'string',
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
        ],
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
        ],
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
        ],
      },
      hidden: ({parent}: any) => parent?.paymentMethod !== 'online',
    },
    {
      name: 'paymentNumber',
      title: 'Payment Number',
      type: 'string',
      hidden: ({parent}: any) => parent?.paymentMethod !== 'online' || !parent?.paymentOption,
    },
    {
      name: 'carDetails',
      title: 'Car Details',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Car Name', type: 'string' },
            { name: 'fuelCapacity', title: 'Fuel Capacity', type: 'string' },
            { name: 'transmission', title: 'Transmission', type: 'string' },
            { name: 'seatingCapacity', title: 'Seating Capacity', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'string', // Store as string or use a date type
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'string', // Store as string or use a date type
    },
  ],
};
