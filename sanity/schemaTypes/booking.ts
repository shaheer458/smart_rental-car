export default {
  name: "booking",
  type: "document",
  title: "Booking",
  fields: [
    { name: "name", type: "string", title: "Full Name" },
    { name: "email", type: "string", title: "Email" },
    { name: "contact", type: "string", title: "Contact Number" },
    { name: "location", type: "string", title: "Location" },
    { name: "paymentMethod", type: "string", title: "Payment Method" },
    { name: "startDate", type: "date", title: "Rental Start Date" },
    { name: "endDate", type: "date", title: "Rental End Date" },
    { name: "totalPrice", type: "number", title: "Total Price" },
    { name: "paymentIntentId", type: "string", title: "Stripe Payment Intent ID" },
    {
      name: "carDetails",
      type: "array",
      title: "Car Details",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Car Name" },
            { name: "fuelCapacity", type: "string", title: "Fuel Capacity" },
            { name: "transmission", type: "string", title: "Transmission" },
            { name: "seatingCapacity", type: "string", title: "Seating Capacity" },
          ],
        },
      ],
    },
  ],
};
