// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    MONGODB_URI: string;
    NEXTAUTH_URL: string;
  }
}

// src/types/googleMaps.d.ts
export type Library = "drawing" | "geometry" | "localContext" | "places";
