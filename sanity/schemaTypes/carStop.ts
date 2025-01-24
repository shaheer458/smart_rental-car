// Sanity Schema: carStop.js
export default {
    name: 'carStop',
    title: 'Car Stop',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Stop Name',
        type: 'string',
      },
      {
        name: 'location',
        title: 'Location',
        type: 'string',
      },
      {
        name: 'cars',
        title: 'Available Cars',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'carName',
                title: 'Car Name',
                type: 'string',
              },
              {
                name: 'isAvailable',
                title: 'Is Available',
                type: 'boolean',
              },
            ],
          },
        ],
      },
    ],
  };
  