import React from 'react'
import Image from 'next/image'
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// CarCard Component for displaying car details
const CarCard = ({ car: { name, type, image, price, favorite } }) => {
  return (
    <Card className="w-full max-w-[304px] mx-auto h-auto flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {name}
          <Image
            src={favorite ? "/love4.png" : "/love5.png"}
            alt="Favorite Icon"
            width={20}
            height={20}
          />
        </CardTitle>
        <CardDescription>{type}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <Image
          src={image}
          alt={`Image of ${name}`}
          width={220}
          height={68}
        />
        <Image src={"/pic2.png"} alt="Additional Info" width={256} height={24} />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p>${price}/<span className="text-gray-500">day</span></p>
        <Link href="/payment">
          <a className="bg-[#3563e9] p-2 text-white rounded-md">Rent Now</a>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function Page() {
  const recentCars = [
    {
      id: 1,
      name: "Koenigsegg",
      type: "Sport",
      image: "/car15.png",
      price: 99,
      favorite: true,
    },
    {
      id: 2,
      name: "Nissan GT-R",
      type: "Sport",
      image: "/car16.png",
      price: 99,
      favorite: false,
    },
    {
      id: 3,
      name: "Rolls-Royce",
      type: "Sedan",
      image: "/car17.png",
      price: 99,
      favorite: true,
    },
  ]

  const recommendationCars = [
    {
      id: 4,
      name: "All New Rush",
      type: "SUV",
      image: "/car2.png",
      price: 99,
      favorite: false,
    },
    {
      id: 5,
      name: "CR-V",
      type: "SUV",
      image: "/car3.png",
      price: 99,
      favorite: true,
    },
    {
      id: 6,
      name: "Toyota - Avanza",
      type: "Sedan",
      image: "/car4.png",
      price: 99,
      favorite: false,
    },
  ]

  return (
    <div className="w-full flex flex-col md:flex-row">
      {/* Sidebar Image */}
      <div className="hidden sm:flex sm:w-[25%] bg-white">
        <Image
          src={'/sidebar.png'}
          alt="Sidebar image"
          width={360}
          height={1600}
          className="w-full h-auto"
        />
      </div>

      {/* Main Content */}
      <div className="w-full sm:w-[75%] bg-[#f6f7f9] p-4 sm:p-6 flex flex-col gap-10 font-[family-name:var(--font-geist-sans)]">
        {/* Image Section */}
        <section className="flex flex-col md:flex-row gap-5 items-center justify-center md:justify-between">
          <div className="flex flex-col gap-4 w-full lg:max-w-[470px] lg:max-h-[508px]">
            <div>
              <Image
                src={'/View.png'}
                alt="Car View"
                width={492}
                height={360}
                className="w-full h-auto"
              />
            </div>
            <div className="flex items-center justify-between gap-2 lg:gap-0">
              <Image src={'/View 1.png'} alt="View 1" width={148} height={124} />
              <Image src={'/View 2.png'} alt="View 2" width={148} height={124} />
              <Image src={'/View 3.png'} alt="View 3" width={148} height={124} />
            </div>
          </div>
          <div className="flex flex-col w-full lg:max-w-[492px] bg-white rounded-xl shadow-md">
            <Image
              src={"/Detail Car (1).png"}
              alt="Detail Car"
              width={492}
              height={392}
              className="w-full h-auto rounded-t-xl object-cover"
            />

            <div className="p-4 flex flex-col items-center sm:flex-row sm:justify-between sm:gap-4">
              <h1 className="font-bold text-lg sm:text-xl lg:text-2xl">
                $80.00 / <span className="text-gray-500 text-sm lg:text-base">day $100.00</span>
              </h1>
              <Link href="/payment">
                <a className="bg-[#3563e9] hover:bg-[#264ac6] transition-all p-3 sm:p-4 px-6 sm:px-10 text-nowrap text-white rounded-md w-full sm:w-auto">
                  Rent Now
                </a>
              </Link>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="flex items-center justify-center">
          <Image
            src={'/Reviews.png'}
            alt="Reviews"
            width={1010}
            height={452}
            className="hidden md:flex"
          />
          <Image
            src={'/Reviews (1).png'}
            alt="Mobile Reviews"
            width={492}
            height={384}
            className="md:hidden"
          />
        </section>

        {/* Recent Cars Section */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between px-4 sm:px-10 xl:px-14">
            <h1 className="text-gray-500 text-lg sm:text-xl">Recent Car</h1>
            <Link href="/categories">
              <a className="text-[#3563e9] font-bold hover:underline decoration-[#3563e9]">
                View All
              </a>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:px-5">
            {/* Rendering Recent Car Cards */}
            {recentCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>

        {/* Recommendation Cars Section */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between px-4 sm:px-10 xl:px-14">
            <h1 className="text-gray-500 text-lg sm:text-xl">Recommendation Car</h1>
            <Link href="/categories">
              <a className="text-[#3563e9] font-bold hover:underline decoration-[#3563e9]">
                View All
              </a>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:px-5">
            {/* Rendering Recommended Car Cards */}
            {recommendationCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}