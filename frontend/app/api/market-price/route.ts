export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const crop = url.searchParams.get("crop");

    if (!crop) {
      return NextResponse.json({ error: "Missing crop parameter" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json({ error: "Backend URL not set" }, { status: 500 });
    }

    const res = await fetch(`${backendUrl}/api/market-prices?crop=${crop}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching market prices:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
