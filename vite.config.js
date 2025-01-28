import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fixReactVirtualized from "esbuild-plugin-react-virtualized";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
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
          // target: "http://ammtools.cern.ch:10880/",
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
