import * as Vite from "vite";

const config = Vite.defineConfig(({ command, mode }): Vite.UserConfig => {
    const buildMode = mode === "production" ? "production" : "development";
    const outDir = "dist";
    return {
        root: "./",
        base: command === "build" ? "./" : "/modules/the-longest-mile/",
        publicDir: "static",
        define: {
            BUILD_MODE: JSON.stringify(buildMode),
        },
        esbuild: { keepNames: true },
        build: {
            outDir,
            emptyOutDir: false,
            minify: false,
            sourcemap: true,
            lib: {
                name: "the-longest-mile",
                entry: "src/scripts/hooks.js",
                formats: ["es"],
                fileName: "the-longest-mile",
            },
            rollupOptions: {
                output: {
                    assetFileNames: ({ name }): string =>
                        name === "style.css" ? "styles/the-longest-mile.css" : name!,
                    chunkFileNames: "[name].mjs",
                    entryFileNames: "the-longest-mile.mjs",
                    manualChunks: {
                        vendor: [],
                    },
                },
                watch: { buildDelay: 100 },
            },
        },
        server: {
            port: 30001,
            open: "/game",
            proxy: {
                "^(?!/modules/the-longest-mile/)": "http://localhost:30000/",
                "/socket.io": {
                    target: "ws://localhost:30000",
                    ws: true,
                },
            },
        },
        css: {
            devSourcemap: true,
        },
    };
});

// eslint-disable-next-line import/no-default-export
export default config;