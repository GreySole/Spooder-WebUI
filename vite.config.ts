import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The Spooder backend proxies none of this for us in dev - it only serves the
// production build (see ../Spooder/src/core/service/WebService.ts). These are
// every API prefix used by src/app/api/*Slice.ts's fetchBaseQuery baseUrls.
const apiPrefixes = [
  '/events',
  '/users',
  '/plugin',
  '/module',
  '/obs',
  '/config',
  '/recovery',
  '/shares',
  '/theme',
  '/server',
];

export default defineConfig({
  plugins: [react()],
  // @greysole/spooder-component-library is a symlinked local `file:` dependency
  // (see package.json). Without this, Vite resolves imports inside it against its
  // real path outside node_modules and can't find hoisted deps like react-dom.
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    port: 3001,
    proxy: Object.fromEntries(
      apiPrefixes.map((prefix) => [prefix, { target: 'http://localhost:3000', changeOrigin: true }]),
    ),
  },
  build: {
    // The backend expects a folder literally named `build`, not Vite's default `dist`.
    outDir: 'build',
  },
});
