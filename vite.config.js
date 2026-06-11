import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
        // basicSsl({
        //     /** name of certification */
        //     name: "test",
        //     /** custom trust domains */
        //     domains: ["*.custom.com"],
        //     /** custom certification directory */
        //     certDir: "/Users/.../.devServer/cert",
        // }),
    ],
    esbuild: {
        supported: {
            "top-level-await": true, //browsers can handle top-level-await features
        },
    },
    server: {
        // Fijamos el host para que Vite no escuche en [::1] (IPv6) y los
        // assets de HMR se sirvan desde una URL estable.
        host: "127.0.0.1",
        port: 5173,
        strictPort: true,
        // La app se sirve desde el dominio de Laragon (frecuencias.test), un
        // origen distinto al del dev server, así que hay que permitir CORS.
        cors: {
            origin: /https?:\/\/(.+\.)?frecuencias\.test(:\d+)?$/,
        },
        hmr: {
            host: "127.0.0.1",
        },
    },
});
