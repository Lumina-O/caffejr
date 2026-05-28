export async function POST() {
  return Response.json(
    { error: "Booking is not available yet." },
    { status: 503 }
  );
}
