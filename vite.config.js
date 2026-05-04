import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/portfolio/",

  appType: "spa",

  server: {
    fs: {
      strict: false,
    },
  },
}));
