import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    // Clases de color compuestas en tiempo de ejecución a partir de valores
    // guardados en BD (Contacto.jsx, EditarContacto.jsx, UserImage.jsx,
    // DatosUsuario.jsx, Colores.jsx, TipoContacto.jsx) y por tanto invisibles
    // para el escáner estático de Tailwind. Anclado a los 3 prefijos que se
    // generan realmente: sin anclar, el patrón coincidía con cualquier
    // utilidad que contuviera "-color-tono" (bg, text, border, ring, from,
    // to, via, divide, placeholder, accent, caret, decoration, outline,
    // fill, stroke, shadow...), inflando el CSS final a varias MB.
    safelist: [
        {
            pattern:
                /^(bg|from|to)-(red|green|blue|yellow|pink|rose|violet|purple|fuchsia|orange|gray|emerald|sky|indigo)-(100|200|300|400|500|600|700|800|900)$/,
        },
    ],

    theme: {
        extend: {
            screens: {
                desktop: "1280px",
                // => @media (min-width: 1280px) { ... }
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                ethno: ["Ethnocentric", ...defaultTheme.fontFamily.sans],
                lcd: ["ds-digit", ...defaultTheme.fontFamily.mono],
            },
            colors: {
                colorbg: "var(--color-bg)",
                colortxt: "var(--color-text)",
                colorpri: "var(--color-primary)",
                coloracc: "var(--color-accent)",
                colortxt200: "var(--color-text-200)",
                colorbg200: "var(--color-bg-200)",
                colorbg300: "var(--color-bg-300)",
                colorbg500: "var(--color-bg-500)",
                colorbg700: "var(--color-bg-700)",
                colorbg900: "var(--color-bg-900)",
                colorpri300: "var(--color-primary-300)",
                coloracc200: "var(--color-accent-200)",

                // Tema escáner (chasis + LCD ámbar).
                chasis: "var(--esc-chasis-alto)",
                chasisbajo: "var(--esc-chasis-bajo)",
                panel: "var(--esc-panel)",
                escborde: "var(--esc-borde)",
                rotulo: "var(--esc-rotulo)",
                lcd: "var(--esc-lcd-on)",
                lcdoff: "var(--esc-lcd-off)",
                lcdbg: "var(--esc-lcd-fondo)",
                ledrx: "var(--esc-led-rx)",
                ledtx: "var(--esc-led-tx)",
                ledmsg: "var(--esc-led-msg)",
            },
            boxShadow: {
                tecla: "var(--esc-tecla)",
                pulsada: "var(--esc-tecla-pulsada)",
                hundido: "var(--esc-hundido)",
            },
            backgroundImage: {
                login: "url('/img/fondo_login.webp')",
            },
            dropShadow: {
                circle: "0px 0px 5px rgba(255, 255, 0, 0.95)",
                led: "0 0 6px currentColor",
            },
        },
    },
    plugins: [forms],
};
