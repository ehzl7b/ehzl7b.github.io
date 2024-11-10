import { defineConfig } from "astro/config";

export default defineConfig({
    trailingSlash: "never",
    srcDir: "./_src",
    outDir: "./_site",
    publicDir: "./_asset",
    build: {
        format: "preserve",
        inlineStylesheets: "never",
    },
    markdown: {
        syntaxHighlight: false,
    },
});