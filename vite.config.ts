import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/spese-app/",

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Le mie spese",
        short_name: "Spese",
        description: "Gestione personale delle spese",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/spese-app/",
        scope: "/spese-app/",
        icons: [
          {
            src: "/spese-app/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/spese-app/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        navigateFallback: "/spese-app/index.html",
      },
    }),
  ],
});
