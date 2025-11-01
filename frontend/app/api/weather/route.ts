import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/weather?lat=${lat}&lon=${lon}`);
  const data = await res.json();
  return NextResponse.json(data);
}
