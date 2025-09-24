import { createClient } from "next-sanity";

export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-09-20",
  token: process.env.SANITY_API_TOKEN, // keep secret (no NEXT_PUBLIC_)
  useCdn: false, // fresh data for writes
});
