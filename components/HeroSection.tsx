import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component

const HeroSection = () => {
  return (
    <section className="bg-gray-50 py-8">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        
        {/* Left Card */}
            <h2 className="text-2xl font-bold"></h2>
            <h2 className="text-2xl font-bold"></h2>
        <div className="bg-blue-500 text-white rounded-lg p-6 flex flex-col justify-between relative">
          <div>
            <h2 className="text-2xl font-bold">The Best Platform for Car Rental</h2>
            <p className="mt-2 text-sm">Ease of doing car rental safely and reliably. Of course at a low price.</p>
          </div>

          {/* Corrected Link & Button usage */}
          <Link href="#">
            <button
              className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-md mt-6 self-start hover:bg-blue-800 transition duration-300"
              aria-label="Go to Rental Car page"
            >
              Rental Car
            </button>
          </Link>

          {/* Replace <img> with <Image /> */}
          <Image
            src="/image 7.png" // Add your car image here
            alt="Car"
            width={160} // Set the width of the image
            height={80} // Set the height of the image
            className="mt-6 self-center md:w-40 md:h-16 lg:w-48 xl:w-56"
          />
        </div>

        {/* Right Card */}
        <div className="bg-blue-600 text-white rounded-lg p-6 flex flex-col justify-between relative">
          <div>
            <h2 className="text-2xl font-bold">Easy way to rent a car at a low price</h2>
            <p className="mt-2 text-sm">Providing cheap car rental services and safe and comfortable facilities.</p>
          </div>

          {/* Corrected Link & Button usage */}
          <Link href="#">
            <button
              className="bg-blue-300 text-white font-semibold px-4 py-2 rounded-md mt-6 self-start hover:bg-blue-400 transition duration-300"
              aria-label="Go to Rental Car page"
            >
              Rental Car
            </button>
          </Link>

          {/* Replace <img> with <Image /> */}
          <Image
            src="/image 8.png" // Add your car image here
            alt="Car"
            width={160} // Set the width of the image
            height={80} // Set the height of the image
            className="mt-6 self-center md:w-40 md:h-14 lg:w-48 xl:w-56"
          />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
