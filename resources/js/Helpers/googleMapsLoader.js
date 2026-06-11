import { Loader } from "@googlemaps/js-api-loader";

/**
 * Loader único de Google Maps reutilizado por todos los componentes de mapa.
 * La API key se lee de la variable de entorno VITE_GOOGLE_MAPS_API_KEY
 * (definida en el .env), nunca hardcodeada en el código.
 */
export const googleMapsLoader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
    version: "weekly",
});
