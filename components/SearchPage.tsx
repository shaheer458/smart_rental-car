'use client';

import React, { useEffect, useState } from 'react';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Extract query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    setQuery(searchQuery);

    // Simulate fetching data based on the search query
    if (searchQuery) {
      // Example of hardcoded search results
      // You can replace this with a real API call or logic to filter your data
      setSearchResults([
        { name: 'Honda CR-V', model: 'SUV' },
        { name: 'Toyota RAV4', model: 'SUV' },
      ]);
    }
  }, []);

  return (
    <div>
      <h1>Search Results for: {query}</h1>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((car, index) => (
            <li key={index}>{car.name} - {car.model}</li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
