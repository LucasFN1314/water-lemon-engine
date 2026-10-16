import { defineConfig } from "vite";

const kaplayCongrats = () => {
    return {
        name: "vite-plugin-kaplay-hello",
        buildEnd() {
            const line =
                "---------------------------------------------------------";
            const msg = `🦖 Awesome pal! Send your game to us:\n\n💎 Discord: https://discord.com/invite/aQ6RuQm3TF \n💖 Donate to KAPLAY: https://opencollective.com/kaplay\n\ (you can disable this msg on vite.config)`;

            process.stdout.write(`\n${line}\n${msg}\n${line}\n`);
        },
    };
};

const rawHtmlHmr = () => {
    const handle = (file, server, modules) => {
        if (file.includes("src") && file.endsWith(".html")) {
            const clientEnv = server?.environments?.client || server;
            const moduleGraph = clientEnv?.moduleGraph || server?.moduleGraph;
            if (moduleGraph) {
                const normalized = file.replace(/\\/g, "/");
                const rawMod =
                    moduleGraph.getModuleById(file + "?raw") ||
                    moduleGraph.getModuleById(normalized + "?raw") ||
                    moduleGraph.getModuleById("/" + normalized + "?raw");
                if (rawMod) {
                    return [rawMod];
                }
            }
        }
        return modules;
    };

    return {
        name: "vite-plugin-raw-html-hmr",
        hotUpdate(ctx) {
            return handle(ctx.file, ctx.server, ctx.modules);
        },
        handleHotUpdate(ctx) {
            return handle(ctx.file, ctx.server, ctx.modules);
        },
    };
};

export default defineConfig({
    // index.html out file will start with a relative path for script
    base: "./",
    server: {
        port: 3001,
    },
    build: {
        // disable this for low bundle sizes
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules/kaplay")) {
                        return "kaplay";
                    }
                },
            },
        },
    },
    plugins: [
        rawHtmlHmr(),
        // Disable messages removing this line
        kaplayCongrats(),
    ],
});