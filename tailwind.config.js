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

    safelist: [
        "bg-gray-500",
        {
            pattern:
                /bg-(red|green|blue|yellow|cyan|pink|orange|teal|purple|indigo)-(500|600|700|800|900)/,
        },
        {
            pattern:
                /to--(red|green|blue|yellow|cyan|pink|orange|teal|purple|indigo)-(500|600|700|800|900)/,
        },
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                ethno: ["Ethnocentric"],
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
                colorpri300: "var(--color-primary-200)",
                coloracc200: "var(--color-accent-200)",
            },
            backgroundImage: {
                login: "url('/img/fondo_login.webp')",
            },
            dropShadow: {
                circle: "0px 0px 5px rgba(255, 255, 0, 0.95)",
            },
        },
    },
    plugins: [forms],
};
