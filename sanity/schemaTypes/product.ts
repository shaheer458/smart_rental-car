// Example schema for the 'product' type
export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
      { name: 'name', title: 'Name', type: 'string' },
      { name: 'price', title: 'Price', type: 'number' },
      { name: 'discountPercentage', title: 'Discount Percentage', type: 'number' },
      { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
      { name: 'image', title: 'Image', type: 'image' },
      { name: 'description', title: 'Description', type: 'text' },
      { name: 'rating', title: 'Rating', type: 'number' },
      { name: 'ratingCount', title: 'Rating Count', type: 'number' },
    ],
  };
  