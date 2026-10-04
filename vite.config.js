import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fixReactVirtualized from "esbuild-plugin-react-virtualized";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifestFilename: "manifest.webmanifest",
        manifest: {
          name: "EAM Light Standalone",
          short_name: "EAM Light",
          description: "EAM Light Standalone Progressive Web App",
          theme_color: "#00aaff",
          background_color: "#ffffff",
          display: "standalone",
          start_url: "/",
          icons: [
            {
              src: "/images/eamlight-logo-32.png",
              sizes: "32x32",
              type: "image/png",
            },
            {
              src: "/images/eamlight_logo.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/images/eamlight_logo.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          navigateFallback: "/index.html",
        },
      }),
    ],
    base: "/",
    assetsInclude: ["**/*.md"],
    build: {
      outDir: "build",
    },
    resolve: {
      alias: {
        "@": "/src",
      },
      preserveSymlinks: true,
    },
    server: {
      port: parseInt(env.VITE_PORT ?? "3000"),
      host: "0.0.0.0",
      proxy: {
        "/rest": {
          target: `http://localhost:${env.VITE_BACKEND_PORT ?? '8080'}/`,
        },
        "/apis": {
          target: `http://localhost:${env.VITE_BACKEND_PORT ?? '8080'}/`,
          //target: "http://ammtools.cern.ch:10880/",
        },
        "/SSO": {
          target: `http://localhost:${env.VITE_BACKEND_PORT ?? '8080'}/`,
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [fixReactVirtualized],
      },
    },
    define: {
      "process.env.PUBLIC_URL": JSON.stringify(env.VITE_PUBLIC_URL),
      "process.env.REACT_APP_CERN_MODE": JSON.stringify(env.VITE_CERN_MODE),
      "process.env.REACT_APP_BACKEND": JSON.stringify(env.VITE_BACKEND),
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
    },
  };
});
