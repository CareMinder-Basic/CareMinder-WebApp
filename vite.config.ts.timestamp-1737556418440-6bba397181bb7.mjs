// vite.config.ts
import { defineConfig } from "file:///Users/anseungchan/Desktop/careMinder-electron/CareMinder-PC/node_modules/vite/dist/node/index.js";
import react from "file:///Users/anseungchan/Desktop/careMinder-electron/CareMinder-PC/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///Users/anseungchan/Desktop/careMinder-electron/CareMinder-PC/node_modules/vite-tsconfig-paths/dist/index.mjs";
import macrosPlugin from "file:///Users/anseungchan/Desktop/careMinder-electron/CareMinder-PC/node_modules/vite-plugin-babel-macros/dist/plugin.js";
import svgr from "file:///Users/anseungchan/Desktop/careMinder-electron/CareMinder-PC/node_modules/@svgr/rollup/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [macrosPlugin(), react(), tsconfigPaths(), svgr()],
  define: {
    global: {}
  },
  base: "./",
  // 상대 경로로 설정
  build: {
    outDir: "dist"
    // 빌드 디렉토리
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW5zZXVuZ2NoYW4vRGVza3RvcC9jYXJlTWluZGVyLWVsZWN0cm9uL0NhcmVNaW5kZXItUENcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hbnNldW5nY2hhbi9EZXNrdG9wL2NhcmVNaW5kZXItZWxlY3Ryb24vQ2FyZU1pbmRlci1QQy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYW5zZXVuZ2NoYW4vRGVza3RvcC9jYXJlTWluZGVyLWVsZWN0cm9uL0NhcmVNaW5kZXItUEMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcbmltcG9ydCBtYWNyb3NQbHVnaW4gZnJvbSBcInZpdGUtcGx1Z2luLWJhYmVsLW1hY3Jvc1wiO1xuaW1wb3J0IHN2Z3IgZnJvbSBcIkBzdmdyL3JvbGx1cFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFttYWNyb3NQbHVnaW4oKSwgcmVhY3QoKSwgdHNjb25maWdQYXRocygpLCBzdmdyKCldLFxuICBkZWZpbmU6IHtcbiAgICBnbG9iYWw6IHt9LFxuICB9LFxuICBiYXNlOiBcIi4vXCIsIC8vIFx1QzBDMVx1QjMwMCBcdUFDQkRcdUI4NUNcdUI4NUMgXHVDMTI0XHVDODE1XG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcImRpc3RcIiwgLy8gXHVCRTRDXHVCNERDIFx1QjUxNFx1QjgwOVx1RDFBMFx1QjlBQ1xuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNXLFNBQVMsb0JBQW9CO0FBQ25ZLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGtCQUFrQjtBQUN6QixPQUFPLFVBQVU7QUFJakIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLGFBQWEsR0FBRyxNQUFNLEdBQUcsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUFBLEVBQzFELFFBQVE7QUFBQSxJQUNOLFFBQVEsQ0FBQztBQUFBLEVBQ1g7QUFBQSxFQUNBLE1BQU07QUFBQTtBQUFBLEVBQ04sT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBO0FBQUEsRUFDVjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
