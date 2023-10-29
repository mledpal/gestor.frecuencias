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
                colorpri300: "var(--color-primary-200)",
                coloracc200: "var(--color-accent-200)",
            },
        },
    },

    plugins: [forms],
};
