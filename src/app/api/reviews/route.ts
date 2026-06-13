import { NextRequest, NextResponse } from "next/server";
import { fetchGoogleReviews } from "@/lib/googleReviews";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") === "da" ? "da" : "en";

  const reviews = await fetchGoogleReviews(lang);

  return NextResponse.json({ reviews });
}
