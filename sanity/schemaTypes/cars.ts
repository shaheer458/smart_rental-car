export default {
  name: 'carDataTypes',
  type: 'document',
  title: 'Car Data Types',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Car Name',
      description: 'Name of the car (e.g., Tesla Model S, Honda Civic)',
    },
    {
      name: 'brand',
      type: 'string',
      title: 'Brand',
      description: 'Brand of the car (e.g., Nissan, Tesla, Honda)',
    },
    {
      name: 'type',
      type: 'string',
      title: 'Car Type',
      description: 'Type of the car (e.g., Sport, Sedan, SUV, Electric)',
    },
     {
      name: 'image_url',
      title: 'Car Image URL',
      type: 'url',
    },
    {
      name: 'fuelCapacity',
      type: 'string',
      title: 'Fuel Capacity',
      description: 'Fuel capacity or battery capacity (e.g., 90L, 100kWh)',
      initialValue: 'Not specified',  // Default value
    },
    {
      name: 'transmission',
      type: 'string',
      title: 'Transmission',
      description: 'Type of transmission (e.g., Manual, Automatic)',
    },
    {
      name: 'seatingCapacity',
      type: 'string',
      title: 'Seating Capacity',
      description: 'Number of seats (e.g., 2 People, 4 seats)',
    },
    {
      name: 'pricePerDay',
      type: 'number',  // Changed to 'number' for correct pricing
      title: 'Price Per Day',
      description: 'Rental price per day (e.g., $50/day)',
    },
    {
      name: 'originalPrice',
      type: 'number',  // Changed to 'number' for correct pricing
      title: 'Original Price',
      description: 'Original price before discount (if applicable)',
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Tags for categorization (e.g., popular, recommended)',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Car Image',
      options: {
        hotspot: true,
      },
      description: 'Image of the car',
    },
  ],
};
