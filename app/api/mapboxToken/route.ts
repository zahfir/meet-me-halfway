import { NextResponse } from "next/server";

export const GET = async (): Promise<NextResponse<unknown>> => {
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    return new NextResponse("Mapbox token not found", { status: 500 });
  }

  return NextResponse.json({ token: mapboxToken });
};
