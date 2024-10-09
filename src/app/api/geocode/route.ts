// src/pages/api/geocode.ts

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface GeocodeResponse {
  status: string;
  results: google.maps.GeocoderResult[];
}

interface ApiResponseData {
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string | null;
}

export async function GET(req: NextRequest) {
  // Extract query parameters from the URL
  const { searchParams } = req.nextUrl;
  const address = searchParams.get("address");

  // Validate the address parameter
  if (!address) {
    return NextResponse.json(
      { error: "Address field cannot be empty." },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Check if the API key is available
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key is missing." },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get<GeocodeResponse>(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: apiKey,
        },
      }
    );

    const data = response.data;

    // Check if the geocoding was successful
    if (data.status !== "OK" || data.results.length === 0) {
      return NextResponse.json(
        { error: "No results found for the provided address." },
        { status: 404 }
      );
    }

    const result = data.results[0];
    const addressComponents = result.address_components;

    // Helper function to find specific address components
    const findComponent = (type: string): string | null => {
      const component = addressComponents.find((comp) =>
        comp.types.includes(type)
      );
      return component ? component.long_name : null;
    };

    const city =
      findComponent("locality") ||
      findComponent("sublocality") ||
      findComponent("administrative_area_level_3") ||
      null;
    const country = findComponent("country");
    const formattedAddress = result.formatted_address || null;
    const latitude = result.geometry.location.lat; // Access as property, not function
    const longitude = result.geometry.location.lng; // Access as property, not function

    // Ensure that latitude and longitude are numbers
    const parsedLatitude = typeof latitude === "number" ? latitude : null;
    const parsedLongitude = typeof longitude === "number" ? longitude : null;

    return NextResponse.json<ApiResponseData>(
      {
        city,
        country,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        formattedAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Geocoding API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch geocoding data." },
      { status: 500 }
    );
  }
}
