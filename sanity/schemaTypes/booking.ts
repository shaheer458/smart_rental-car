export default {
  name: "booking",
  type: "document",
  title: "Booking",
  fields: [
    { name: "bookingId", type: "string" },
    { name: "name", type: "string" },
    { name: "email", type: "string" },
    { name: "contact", type: "string" },
    { name: "location", type: "string" },
    { name: "paymentMethod", type: "string" },
    { name: "startDate", type: "string" },
    { name: "endDate", type: "string" },
    { name: "totalPrice", type: "number" },
    { name: "paymentIntentId", type: "string" },
    {
      name: "carDetails",
      type: "array",
      of: [
        {
          type: "object",        // Type of array element
          name: "carDetail",     // Name used as _type in code
          title: "Car Detail",
          fields: [
            { name: "name", type: "string" },
            { name: "brand", type: "string" },
            { name: "type", type: "string" },
            { name: "fuelCapacity", type: "string" },
            { name: "transmission", type: "string" },
            { name: "seatingCapacity", type: "number" },
            { name: "pricePerDay", type: "number" },
            { name: "image", type: "string" },
          ],
        },
      ],
    },
  ],
};
