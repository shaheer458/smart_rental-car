import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";

export async function POST(req: Request) {
  try {
    const { bookingId, paymentIntentId } = await req.json();
    const updated = await serverClient.patch(bookingId).set({ paymentIntentId }).commit();
    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
