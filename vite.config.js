import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function copySpaFallback() {
  return {
    name: "copy-spa-fallback",
    closeBundle() {
      const index = resolve("dist/index.html");
      if (existsSync(index)) copyFileSync(index, resolve("dist/404.html"));
    },
  };
}

export default defineConfig({
  plugins: [react(), copySpaFallback()],
  base: process.env.GITHUB_PAGES === "true" ? "/ms-omotenashi-concierge/" : "/",
});

