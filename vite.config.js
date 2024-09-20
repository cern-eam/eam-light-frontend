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
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      port: 3000,
      host: "10.211.55.10",
      proxy: {
        "/apis": {
          target: "http://localhost:10880/",
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
    },
  };
});
