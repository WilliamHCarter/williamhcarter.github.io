import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";

const archiveBase = process.env.ARCHIVE_BASE?.replace(/\/$/, "");

export default defineConfig({
  integrations: [solidJs()],
  base: archiveBase || undefined,
  build: {
    inlineStylesheets: "always",
  },
});
