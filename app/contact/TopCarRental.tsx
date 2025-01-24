import { More } from "iconsax-react";
import Image from "next/image"; // Import Image from next/image

const TopCarRental = () => {
  const carCategories = [
    { color: "#0D3559", label: "Sport Car", value: "17,439" },
    { color: "#175D9C", label: "SUV", value: "9,478" },
    { color: "#2185DE", label: "Coupe", value: "18,197" },
    { color: "#63A9E8", label: "Hatchback", value: "12,510" },
    { color: "#A6CEF2", label: "MPV", value: "14,406" },
  ];

  const transactions = [
    {
      image: "https://i.postimg.cc/pT9b7DDZ/popular-Car2.png",
      car: "Nissan GT - R",
      category: "Sport Car",
      date: "20 July",
      price: "$80.00",
    },
    {
      image: "https://i.postimg.cc/2jbrXfGD/popular-Car1.png",
      car: "Koegnigsegg",
      category: "Sport Car",
      date: "19 July",
      price: "$99.00",
    },
    {
      image: "https://i.postimg.cc/pTgbtpCt/popular-Car3.png",
      car: "Rolls - Royce",
      category: "Sport Car",
      date: "18 July",
      price: "$96.00",
    },
    {
      image: "https://i.postimg.cc/ncfbR9M4/recommand-Car2.png",
      car: "CR - V",
      category: "SUV",
      date: "17 July",
      price: "$80.00",
    },
  ];

  return (
    <div className="bg-[#F6F7F9] lg:w-[48%]">
      {/* Top 5 Car Rental */}
      <div className="mt-8 p-4 bg-white rounded-[10px] lg:mt-0">
        <section className="text-[#1A202C] flex justify-between items-center">
          <p className="text-[#1A202C] font-bold text-base lg:text-xl">
            Top 5 Car Rental
          </p>
          <More />
        </section>

        <section className="flex justify-center items-center my-6">
          <Image
            className="relative"
            src="https://i.postimg.cc/3RtSmqz8/Chart.png"
            alt="Chart"
            layout="intrinsic"
            width={500}
            height={300}
          />
          <p className="flex justify-center items-center flex-wrap absolute">
            <span className="w-full text-center text-[#1A202C] font-bold text-[28px] lg:text-2xl">
              72,030
            </span>
            <span className="w-full text-center text-[#90A3BF] font-medium text-sm mt-1">
              Rental Car
            </span>
          </p>
        </section>

        <ul className="mt-6">
          {carCategories.map(({ color, label, value }, index) => (
            <li key={index} className="flex justify-between items-center font-semibold text-sm mt-4">
              <div className="flex items-center">
                <span className={`bg-[${color}] w-3 h-3 rounded-full block mr-3`}></span>
                <span className="text-[#90A3BF]">{label}</span>
              </div>
              <span className="text-[#1A202C]">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Transaction */}
      <div className="mt-8 p-4 bg-white rounded-[10px]">
        <section className="flex justify-between items-center">
          <p className="text-[#1A202C] font-bold text-base lg:text-xl">
            Recent Transaction
          </p>
          <span className="text-[#3563E9] font-medium text-xs">View All</span>
        </section>

        <ul className="mt-6">
          {transactions.map(({ image, car, category, date, price }, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b-[1px] border-[#C3D4E966] py-3"
            >
              <div className="relative w-[76px]">
                <Image
                  src={image}
                  alt={car}
                  layout="intrinsic"
                  width={76}
                  height={50}
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[#1A202C] font-bold text-sm lg:text-base">{car}</span>
                <span className="text-[#90A3BF] font-medium text-xs mt-2">{category}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[#90A3BF] font-medium text-xs">{date}</span>
                <span className="text-[#1A202C] font-bold text-base mt-2">{price}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopCarRental;
