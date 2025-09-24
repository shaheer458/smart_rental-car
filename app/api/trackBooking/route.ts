import { NextRequest, NextResponse } from "next/server";

// Mock bookings database (replace with your DB)
const bookings = [
  { bookingId: "BK12345", status: "On the way", currentLocation: "Hyderabad" },
  { bookingId: "BK54321", status: "Confirmed", currentLocation: "Karachi" },
];

export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ success: false, error: "Booking ID missing." });
  }

  const booking = bookings.find((b) => b.bookingId === bookingId);

  if (!booking) {
    return NextResponse.json({ success: false, error: "Booking not found." });
  }

  return NextResponse.json({ success: true, ...booking });
}
