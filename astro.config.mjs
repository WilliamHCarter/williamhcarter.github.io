import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";

import tailwind from "@astrojs/tailwind";

const archiveBase = process.env.ARCHIVE_BASE?.replace(/\/$/, "");

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind()],
  base: archiveBase || undefined,
  build: {
    inlineStylesheets: "always",
  },
});
