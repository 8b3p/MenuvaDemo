import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// Custom plugin to replace environment variables in HTML
const htmlEnvReplace = (): Plugin => ({
  name: 'html-env-replace',
  transformIndexHtml(html: string) {
    // Get environment variables
    const env = process.env;
    
    // Replace environment variable placeholders
    return html
      .replace('%VITE_APP_TITLE%', env.VITE_APP_TITLE || 'Menuva')
      .replace('%VITE_APP_LOGO%', env.VITE_APP_LOGO || '')
      .replace('%VITE_ANALYTICS_ENDPOINT%', env.VITE_ANALYTICS_ENDPOINT || '')
      .replace('%VITE_ANALYTICS_WEBSITE_ID%', env.VITE_ANALYTICS_WEBSITE_ID || '');
  },
});

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), htmlEnvReplace()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  }
});
