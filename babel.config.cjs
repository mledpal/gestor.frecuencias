/* eslint-disable no-undef */

module.exports = {
    presets: [
        [
            "@babel/preset-env",
            { targets: { esmodules: true, node: "current" } },
        ],
        ["@babel/preset-react", { runtime: "automatic" }],
    ],
    plugins: [
        [
            "module-resolver",
            {
                root: ["./"],
                alias: {
                    "@": "./resources/js", // Ruta de tu directorio de JavaScript
                },
            },
        ],
    ],
};
