//Shamelessly stolen froom pf2e system https://github.com/foundryvtt/pf2e
import * as Vite from "vite";
import esbuild from "esbuild";
import fs from "fs-extra";
import path from "path"

const config = Vite.defineConfig(({ command, mode }): Vite.UserConfig => {
    const buildMode = mode === "production" ? "production" : "development";
    const outDir = "dist";

    const plugins: any[] = [];

    if (buildMode === "production") {
        plugins.push({
            name: "minify",
            renderChunk: {
                order: "post",
                async handler(code: any, chunk: { fileName: string; }) {
                    return chunk.fileName.endsWith(".mjs")
                        ? esbuild.transform(code, {
                              keepNames: true,
                              minifyIdentifiers: false,
                              minifySyntax: true,
                              minifyWhitespace: true,
                              sourcemap: true,
                          })
                        : code;
                },
            },
        });
    }else{
        plugins.push(
            // Foundry expects all esm files listed in system.json to exist: create empty vendor module when in dev mode
            {
                name: "touch-vendor-mjs",
                apply: "build",
                writeBundle: {
                    async handler() {
                        fs.closeSync(fs.openSync(path.resolve(outDir, "vendor.mjs"), "w"));
                    },
                },
            },
            // Vite HMR is only preconfigured for css files: add handler for HBS templates
            {
                name: "hmr-handler",
                apply: "serve",
                handleHotUpdate(context: { file: string; server: { ws: { send: (arg0: { type: string; event: string; data: { path: string; }; }) => void; }; }; }) {
                    if (context.file.endsWith(".hbs") && !context.file.startsWith(outDir)) {
                        const basePath = context.file.slice(context.file.indexOf("templates/"));
                        console.log(`Updating template at ${basePath}`);
                        fs.promises.copyFile(context.file, `${outDir}/${basePath}`).then(() => {
                            context.server.ws.send({
                                type: "custom",
                                event: "template-update",
                                data: { path: `modules/the-longest-mile/${basePath}` },
                            });
                        });
                    }
                },
            }
        );
    }

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
            minify: true,
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
        plugins,
        css: {
            devSourcemap: true,
        },
    };
});

export default config;