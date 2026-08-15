import { useMediaQuery } from "@react-hook/media-query";

/**
 * Punto de corte único entre el layout de escritorio (Radio) y el móvil
 * (Walkie/MovilPage). Antes había dos valores distintos: 900px en las
 * páginas de auth y 1000px en AppProvider, con un salto de diseño entre
 * medias que no correspondía a ningún breakpoint real.
 */
export const ANCHO_MAXIMO_MOVIL = 1000;

export const usePantallaPequena = () =>
    useMediaQuery(`(max-width: ${ANCHO_MAXIMO_MOVIL}px)`);
