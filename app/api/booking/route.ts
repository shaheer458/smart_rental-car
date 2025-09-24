import { NextResponse } from "next/server";
import { serverClient } from "@/sanity/lib/serverClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const booking = await serverClient.create({
      _type: "booking",
      ...body,
    });
    return NextResponse.json({ success: true, booking });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
