import sanityClient from '@sanity/client';

// Use environment variables for project ID, dataset, and API token
const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Exposed as NEXT_PUBLIC_SANITY_PROJECT_ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,      // Exposed as NEXT_PUBLIC_SANITY_DATASET
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,      // Use the token from .env.local
  apiVersion: '2025-01-18', // You can use the current date or a fixed version
  useCdn: true, // Optionally set this to `false` during development for more accurate results
});

export { client };
