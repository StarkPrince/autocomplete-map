// src/types/googleMaps.d.ts

export {};

declare global {
  namespace google.maps {
    interface GeocoderResult {
      address_components: AddressComponent[];
      formatted_address: string;
      geometry: GeocoderGeometry;
      // ... other properties as needed
    }

    interface GeocoderGeometry {
      location: GeocoderLocation;
      viewport: LatLngBounds;
    }

    interface GeocoderLocation {
      lat: number;
      lng: number;
    }

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    interface LatLngBounds {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  }
}
