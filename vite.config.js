import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

const host = "127.0.0.1";
const port = "8000";

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
    // server: {
    //     // 005 enabling the HTTPS
    //     https: false,
    //     // 006 setting the proxy with Laravel as target (origin)
    //     proxy: {
    //         "^(?!(/@vite|/resources|/node_modules))": {
    //             target: `http://${host}:${port}`,
    //         },
    //     },
    //     host,
    //     port: 5173,
    //     // 007 be sure that you have the Hot Module Replacement
    //     hmr: { host },
    // },
});
