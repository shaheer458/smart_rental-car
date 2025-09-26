"use client";

import React, { useEffect, useRef, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface Car {
  _id: string;
  name: string;
  brand: string;
  type: string;
  pricePerDay: number | string;
  image: string;
  fuelCapacity: string;
  transmission: string;
  seatingCapacity: number | string;
  rentalDuration: number;
  rentalDays?: number; // NEW: days for this specific car
  tags?: string[];     // NEW: array of tags like "popular" or "recommended"
}



type Msg = {
  id: string;
  from: "user" | "agent";
  text?: string;
  cars?: Car[];
  selectedCar?: Car;
};

export default function AgentChatAndPayment() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1);

  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [tempDays, setTempDays] = useState<number>(0);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    paymentMethod: "",
    startDate: "",
  });

  const [booking, setBooking] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // ✅ Safe parser
  const parsePrice = (p: string | number): number =>
    parseFloat(String(p).replace(/[^0-9.]/g, "")) || 0;

  const pushAgentMessage = (m: Partial<Msg>) => {
    setMsgs((s) => [
      ...s,
      {
        id: String(Math.random()),
        from: "agent",
        text: m.text,
        cars: m.cars,
        selectedCar: m.selectedCar,
      },
    ]);
  };

  const pushUserMessage = (text: string) => {
    setMsgs((s) => [...s, { id: String(Math.random()), from: "user", text }]);
  };

  const apiCall = async (payload: any) => {
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      return { message: "⚠️ Error contacting agent." };
    }
  };

  const sendText = async (txt?: string) => {
  const text = (txt ?? input).trim();
  if (!text) return;
  pushUserMessage(text);
  setInput("");

  // 🔹 Handle track command first
  if (text.toLowerCase().startsWith("track ")) {
    const bookingId = text.split(" ")[1];
    if (!bookingId) {
      return pushAgentMessage({ text: "⚠️ Please provide a booking ID." });
    }

    try {
      const res = await fetch(`/api/trackBooking?bookingId=${bookingId}`);
      const data = await res.json();

      if (data.success) {
        return pushAgentMessage({
          text: `🚗 Booking ${bookingId} status:\n${data.status}\nCurrent location: ${data.currentLocation}`,
        });
      } else {
        return pushAgentMessage({ text: `⚠️ ${data.error}` });
      }
    } catch (err) {
      return pushAgentMessage({ text: "⚠️ Failed to fetch tracking info." });
    }
  }

  // 🔹 Normal step flow
  const payload = { step, answer: text, days: tempDays, ...userData };
  const data = await apiCall(payload);
  if (!data) return pushAgentMessage({ text: "⚠️ No response from server." });

  // ✅ Handle recommended cars separately
  if (data.cars && data.cars.length > 0) {
    const popularCars = data.cars.filter((c: Car) => c.tags?.includes("popular"));
    const recommendedCars = data.cars.filter((c: Car) => c.tags?.includes("recommended"));

    if (popularCars.length > 0) {
      pushAgentMessage({
        text: "🚘 Popular Cars:",
        cars: popularCars,
      });
    }

    if (recommendedCars.length > 0) {
      pushAgentMessage({
        text: "⭐ Recommended Cars:",
        cars: recommendedCars,
      });
    }

    setStep(data.nextStep ?? step + 1);
    return;
  }

  if (data.message) {
    pushAgentMessage({ text: data.message });
    setStep(data.nextStep ?? step + 1);
  }
};


  const chooseCar = (car: Car) => {
    if (selectedCars.find((c) => c._id === car._id)) {
      pushAgentMessage({ text: `${car.name} already added.` });
      return;
    }
    setSelectedCars((prev) => [...prev, car]);
    pushUserMessage(`Added: ${car.name}`);
    setStep(3); // move to days
  };

  const submitDays = (d: number) => {
    setTempDays(d);
    pushUserMessage(`${d} day(s)`);
    setStep(4);
  };

  // ✅ Save booking
  const saveBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !userData.name ||
      !userData.email ||
      !userData.contact ||
      !userData.location ||
      !userData.startDate
    ) {
      return pushAgentMessage({ text: "⚠️ Please fill all required fields." });
    }

    if (selectedCars.length === 0 || tempDays <= 0) {
      return pushAgentMessage({
        text: "⚠️ Please select at least one car and number of days first.",
      });
    }

    const startDate = new Date(userData.startDate);
    const endDate = new Date(startDate.getTime() + tempDays * 86400000);

    const totalPrice = selectedCars.reduce(
      (sum, car) => sum + parsePrice(car.pricePerDay) * tempDays,
      0
    );

    const bookingId = `BK${Math.floor(Math.random() * 90000 + 10000)}`;

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          name: userData.name,
          email: userData.email,
          contact: userData.contact,
          location: userData.location,
          paymentMethod: userData.paymentMethod,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
          totalPrice,
          paymentIntentId: "",
          carDetails: selectedCars.map((car) => ({
            _type: "carDetail",
            _key: car._id,
            name: car.name,
            brand: car.brand,
            type: car.type,
            fuelCapacity: car.fuelCapacity || "N/A",
            transmission: car.transmission || "N/A",
            seatingCapacity: Number(car.seatingCapacity) || 1,
            pricePerDay: parsePrice(car.pricePerDay),
            image: car.image || "",
          })),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setBooking({ _id: data.booking._id, name: userData.name, totalPrice });
      pushAgentMessage({
        text: `✅ Booking saved! ${userData.name}, ${selectedCars.length} car(s) for ${tempDays} day(s). Booking ID: ${bookingId}. Total: $${totalPrice}.`,
      });
      setStep(5);
    } catch (err: any) {
      pushAgentMessage({ text: `❌ Failed to save booking: ${err.message}` });
    }
  };

  const confirmPayment = (method: "cod" | "online") => {
    if (method === "cod") {
      pushAgentMessage({ text: "🚗 Booking Confirmed with Cash on Delivery!" });
      setStep(6);
    }
    if (method === "online") {
      setUserData((prev) => ({ ...prev, paymentMethod: "online" }));
    }
  };
  

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            pushAgentMessage({
              text: "👋 Welcome to SmartCar Rentals! Would you like to see *popular cars* or specify a type (SUV, Sedan, Electric)?",
            });
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg flex items-center justify-center text-2xl"
          title="Open agent"
        >
          💬
        </button>
      )}

      {open && (
        <div
    className="
      fixed
      bottom-4 left-1/2 -translate-x-1/2   /* Mobile center bottom */
      w-[90%] h-[80%]                      /* Mobile size */

      sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0
      sm:w-[60%] sm:h-[70%]                /* Tablet size */

      lg:w-[400px] lg:h-[500px]            /* Desktop size */

      bg-white
      rounded-2xl
      shadow-2xl
      flex flex-col overflow-hidden
      transition-all duration-300 ease-in-out
    "
  >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white font-semibold">
            SmartCar Agent
            <button onClick={() => setOpen(false)} className="text-xl">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={`max-w-full ${
                  m.from === "user" ? "flex justify-end" : "flex justify-start"
                }`}
              >
                <div
                  className={`${
                    m.from === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  } p-3 rounded-lg shadow-sm`}
                >
                  {m.text && <div>{m.text}</div>}
                  {m.cars && (
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {m.cars.map((c) => (
                        <div
                          key={c._id}
                          className="flex gap-3 items-center p-2 border rounded hover:shadow cursor-pointer"
                          onClick={() => chooseCar(c)}
                        >
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-20 h-14 object-cover rounded"
                          />
                          <div>
                            <div className="font-semibold text-sm">{c.name}</div>
                            <div className="text-xs text-gray-500">
                              {c.brand} • {c.type}
                            </div>
                            <div className="text-indigo-600 font-bold">
                              ${parsePrice(c.pricePerDay)}/day
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Input / Forms */}
          <div className="p-3 border-t bg-white overflow-y-auto">
            {step === 3 && (
              <div className="mb-2 space-y-2">
                <div className="flex gap-2">
                  {[1, 2, 3, 5, 7, 10].map((d) => (
                    <button
                      key={d}
                      onClick={() => submitDays(d)}
                      className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      {d}d
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={tempDays || ""}
                    onChange={(e) => setTempDays(Number(e.target.value))}
                    className="w-32 px-3 py-2 border rounded"
                    placeholder="Enter days"
                  />
                  <button
                    onClick={() => tempDays > 0 && submitDays(tempDays)}
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
  <form onSubmit={saveBooking} className="space-y-4 p-3">
    {/* User Details */}
    <div className="grid grid-cols-2 gap-3">
      <input
        type="text"
        placeholder="Your Name"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        required
        className="p-2 border rounded text-sm"
      />
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        required
        className="p-2 border rounded text-sm"
      />
      <input
        type="text"
        placeholder="Phone"
        value={userData.contact}
        onChange={(e) => setUserData({ ...userData, contact: e.target.value })}
        required
        className="p-2 border rounded text-sm"
      />
      <select
        value={userData.location}
        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
        required
        className="p-2 border rounded text-sm"
      >
        <option value="">Location</option>
        <option value="Nawabshah">Nawabshah</option>
        <option value="Sakrand">Sakrand</option>
        <option value="Saeedabad">Saeedabad</option>
        <option value="Hala">Hala</option>
        <option value="Hyderabad">Hyderabad</option>
        <option value="Karachi">Karachi</option>
      </select>
      <input
        type="date"
        value={userData.startDate}
        onChange={(e) => setUserData({ ...userData, startDate: e.target.value })}
        required
        className="p-2 border rounded text-sm col-span-2"
      />
    </div>

    {/* Selected Cars */}
    {selectedCars.length > 0 && (
      <div className="space-y-2">
        <h3 className="text-md font-semibold">Selected Cars</h3>
        <div className="grid grid-cols-2 gap-2">
          {selectedCars.map((car) => (
            <div
              key={car._id}
              className="border p-2 rounded bg-gray-50 text-xs shadow-sm"
            >
              <p className="font-semibold">{car.name}</p>
              <p>{car.brand} • {car.type}</p>
              <p>${parsePrice(car.pricePerDay)}/day</p>
              <p>Days: {tempDays}</p>
              <p className="font-bold">
                ${parsePrice(car.pricePerDay) * tempDays}
              </p>
            </div>
          ))}
        </div>
        <div className="p-2 bg-gray-200 rounded font-bold text-sm text-center">
          Total: $
          {selectedCars.reduce(
            (sum, car) => sum + parsePrice(car.pricePerDay) * tempDays,
            0
          )}
        </div>
      </div>
    )}

    {/* Payment */}
    <select
      name="paymentMethod"
      value={userData.paymentMethod}
      onChange={(e) =>
        setUserData({ ...userData, paymentMethod: e.target.value })
      }
      required
      className="w-full p-2 border rounded text-sm"
    >
      <option value="">Payment Method</option>
      <option value="cod">Cash on Delivery</option>
      <option value="online">Online (Stripe)</option>
    </select>

    {/* Submit */}
    <button
      type="submit"
      className="w-full bg-black text-white py-2 rounded font-semibold text-sm"
    >
      Save Booking
    </button>
  </form>
)}


            {step === 5 && booking && (
              <div className="space-y-2">
                <p className="font-semibold">
                  Hello {booking.name}, Total: ${booking.totalPrice}
                </p>
                <button
                  onClick={() => confirmPayment("cod")}
                  className="bg-green-600 text-white px-3 py-1 rounded w-full"
                >
                  Cash on Delivery
                </button>
                <button
                  onClick={() => confirmPayment("online")}
                  className="bg-blue-600 text-white px-3 py-1 rounded w-full"
                >
                  Pay with Stripe
                </button>
              </div>
            )}

            {userData.paymentMethod === "online" && booking && (
              <Elements
                stripe={stripePromise}
                options={{
                  mode: "payment",
                  amount: convertToSubcurrency(booking.totalPrice),
                  currency: "usd",
                }}
              >
                <CheckoutPage
                  amount={booking.totalPrice}
                  onSuccess={async (intentId: string) => {
                    setPaymentSuccess(true);
                    await fetch("/api/updateBooking", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        bookingId: booking._id,
                        paymentIntentId: intentId,
                      }),
                    });
                    pushAgentMessage({
                      text: "🎉 Payment successful! 🚗 Your booking is confirmed.",
                    });
                    setStep(6);
                  }}
                />
              </Elements>
            )}

            {/* Chat Input */}
            <div className="flex gap-2 mt-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendText();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={() => sendText()}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
