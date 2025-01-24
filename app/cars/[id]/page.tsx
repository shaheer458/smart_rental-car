// pages/cars/[id]/page.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // to capture the URL parameter
import { client } from '@/sanity/lib/client'; // assuming you have the client set up
import Image from 'next/image';

const CarDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the car ID from the URL
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return; // Return if the id is not yet available

    const fetchCarDetails = async () => {
      const query = `*[_type == "carDataTypes" && _id == $id] {
        _id,
        name,
        brand,
        type,
        fuelCapacity,
        transmission,
        seatingCapacity,
        pricePerDay,
        originalPrice,
        tags,
        "image_url": image.asset->url
      }`;

      try {
        const results = await client.fetch(query, { id });
        if (results.length > 0) {
          setCar(results[0]);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
      setLoading(false);
    };

    fetchCarDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!car) return <div>Car not found.</div>;

  return (
    <div className="car-detail p-6">
      <h1 className="text-3xl font-semibold">{car.name}</h1>
      <div className="car-image my-4">
        <Image
          src={car.image_url || '/placeholder.png'}
          alt={car.name}
          width={600}
          height={400}
          objectFit="cover"
        />
      </div>
      <p><strong>Brand:</strong> {car.brand}</p>
      <p><strong>Type:</strong> {car.type}</p>
      <p><strong>Fuel Capacity:</strong> {car.fuelCapacity}</p>
      <p><strong>Transmission:</strong> {car.transmission}</p>
      <p><strong>Seating Capacity:</strong> {car.seatingCapacity}</p>
      <p><strong>Price per Day:</strong> {car.pricePerDay}</p>
      <p><strong>Original Price:</strong> {car.originalPrice}</p>
      <p><strong>Tags:</strong> {car.tags.join(', ')}</p>
    </div>
  );
};

export default CarDetailPage;
