import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

type ReqBody = {
  step?: number;
  answer?: string;
  selectedCarId?: string;
  days?: number | string;
  name?: string;
  email?: string;
  contact?: string;
  location?: string;
  paymentMethod?: string;
  bookingId?: string;
};

// Helper to fetch cars or bookings
async function fetchData(groq: string, params: any = {}) {
  return client.fetch(groq, params);
}

export async function POST(req: Request) {
  try {
    const body: ReqBody = (await req.json().catch(() => ({}))) as ReqBody;
    const step = typeof body.step === "number" ? body.step : 0;
    const lower = (body.answer || "").toLowerCase();

    // -------------------- STEP 0: Welcome --------------------
    // if (step === 0) {
    //   return NextResponse.json({
    //     type: "prompt",
    //     message:
    //       "👋 Welcome to SmartCar Rentals! Would you like to see *popular cars* or specify a type (SUV, Sedan, Electric)?",
    //     options: [
    //       { id: "popular", label: "Show popular cars" },
    //       { id: "specify", label: "Specify type" },
    //     ],
    //     nextStep: 1,
    //   });
    // }

    // -------------------- STEP 1: Show cars --------------------
    if (step === 1) {
  let cars;

  if (lower.includes("popular")) {
    cars = await fetchData(`*[_type == "carDataTypes" && "popular" in tags]{
      _id, name, brand, type, pricePerDay, seatingCapacity, transmission, fuelCapacity,
      "image": image.asset->url, tags
    }`);
  } else if (lower.includes("recommended")) {
    cars = await fetchData(`*[_type == "carDataTypes" && "recommended" in tags]{
      _id, name, brand, type, pricePerDay, seatingCapacity, transmission, fuelCapacity,
      "image": image.asset->url, tags
    }`);
  } else {
    // Check for specific types
    const typeMatch = lower.match(/suv|sedan|electric|sport|luxury/);
    if (!typeMatch) {
      return NextResponse.json({
        type: "prompt",
        message:
          "⚠️ Reply with 'popular', 'recommended', or a type (SUV, Sedan, Electric, Sport, Luxury).",
        nextStep: 1,
      });
    }
    const t = typeMatch[0];
    cars = await fetchData(`*[_type == "carDataTypes" && lower(type) match "${t}"]{
      _id, name, brand, type, pricePerDay, seatingCapacity, transmission, fuelCapacity,
      "image": image.asset->url, tags
    }`);
  }

  return NextResponse.json({
    type: "cars",
    message: "🚘 Please select a car by clicking on it.",
    cars,
    nextStep: 2,
  });
}


    // -------------------- STEP 2: Car selection --------------------
    if (step === 2) {
      if (!body.selectedCarId) {
        return NextResponse.json({ type: "prompt", message: "⚠️ Please select a car.", nextStep: 2 });
      }

      const car = await fetchData(
        `*[_type == "carDataTypes" && _id == $id][0]{
          _id, name, brand, type, pricePerDay, seatingCapacity, transmission, fuelCapacity,
          "image": image.asset->url
        }`,
        { id: body.selectedCarId }
      );

      if (!car)
        return NextResponse.json({ type: "prompt", message: "❌ Invalid car id.", nextStep: 2 });

      return NextResponse.json({
        type: "prompt",
        message: `✅ You selected ${car.name} — $${car.pricePerDay}/day. How many days would you like to rent?`,
        selectedCar: car,
        nextStep: 3,
      });
    }

    // -------------------- STEP 3: Choose rental days --------------------
    if (step === 3) {
      const days = Number(body.days || body.answer);
      if (!days || isNaN(days))
        return NextResponse.json({
          type: "prompt",
          message: "⚠️ Enter valid number of days.",
          nextStep: 3,
        });

      return NextResponse.json({
        type: "prompt",
        message: `📅 Booking for ${days} day(s). Please fill your info below.`,
        days,
        paymentOptions: [
          { id: "cod", label: "Cash on Delivery" },
          { id: "jazzcash", label: "JazzCash" },
          { id: "easypaisa", label: "EasyPaisa" },
          { id: "bank", label: "Bank Transfer" },
          { id: "stripe", label: "Stripe (Card)" },
        ],
        nextStep: 4,
      });
    }


    // -------------------- STEP 5: Payment / Tracking --------------------
    if (step === 5) {
      return NextResponse.json({
        type: "payment",
        message: "Choose your payment method or track your booking using your ID.",
        nextStep: 6,
      });
    }

    // -------------------- STEP 6: Thanks --------------------
    if (step === 6) {
      return NextResponse.json({
        type: "thanks",
        message:
          "🙏 Thanks for booking with SmartCar Rentals! Reply 'track BK12345' anytime to track your car.",
      });
    }

    return NextResponse.json({ message: "⚠️ Unknown step. Start with step 0." });
  } catch (err: any) {
    console.error("❌ API Error:", err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}
