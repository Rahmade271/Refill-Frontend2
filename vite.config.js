import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
plugins: [react(), tailwindcss()],
  server: {
    port: 5173,       // Paksa pakai port ini
    strictPort: true, // Jangan geser ke 5174 kalau error, mending error sekalian biar ketahuan
    host: true, 
    allowedHosts: [
      "unsubscribing-pacifically-norene.ngrok-free.dev"
    ],
  },
});