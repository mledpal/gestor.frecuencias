import { useMemo } from "react";
import { reproducirClick } from "@/Helpers/sonidos";

/**
 * Props que convierten cualquier elemento en una tecla física: hundido
 * visual (clase "clicked", ver escaner.css) y sonido de click al pulsar.
 *
 * Sustituye a los listeners globales de Radio/js/boton.js y
 * Walkie/js/walkie.js, enganchados a DOMContentLoaded — evento que solo
 * dispara en la carga inicial, así que navegar entre /login y /register
 * por Inertia (sin recarga completa) dejaba las teclas mudas. Usa eventos
 * "pointer" en vez de "mouse" para que también funcione en táctil.
 */
export const useTeclaFisica = ({ silencio = false } = {}) =>
    useMemo(
        () => ({
            onPointerDown: (e) => {
                e.currentTarget.classList.add("clicked");
                if (!silencio) reproducirClick("entrada");
            },
            onPointerUp: (e) => {
                e.currentTarget.classList.remove("clicked");
                if (!silencio) reproducirClick("salida");
            },
            onPointerLeave: (e) => e.currentTarget.classList.remove("clicked"),
            onPointerCancel: (e) =>
                e.currentTarget.classList.remove("clicked"),
        }),
        [silencio]
    );
