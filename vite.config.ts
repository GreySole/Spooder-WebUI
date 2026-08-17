import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

// The Spooder backend proxies none of this for us in dev - it only serves the
// production build (see ../Spooder/src/core/service/WebService.ts). These are
// every API prefix used by src/app/api/*Slice.ts's fetchBaseQuery baseUrls, plus
// any other backend-served path referenced directly (e.g. /assets for media src=).
const corePrefixes = [
  '/events',
  '/users',
  '/plugin',
  '/module',
  '/config',
  '/recovery',
  '/shares',
  '/theme',
  '/server',
  '/assets',
];

// Modules serve their API under /<module key> - the baseUrl each module's backend counterpart
// returns from getRouters(). Read off disk rather than listed by hand, the same way
// scripts/generate-registry.js discovers modules, so installing one doesn't silently 404 in
// dev: unproxied requests never reach the backend, they just hit vite's own 404.
const installedModulesDir = path.resolve(import.meta.dirname, 'src/modules/installed');
const modulePrefixes = fs.existsSync(installedModulesDir)
  ? fs
      .readdirSync(installedModulesDir)
      .filter((name) => fs.existsSync(path.join(installedModulesDir, name, 'index.ts')))
      .map((name) => `/${name}`)
  : [];

const apiPrefixes = [...new Set([...corePrefixes, ...modulePrefixes])];

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: Object.fromEntries(
      apiPrefixes.map((prefix) => [prefix, { target: 'http://localhost:3001', changeOrigin: true }]),
    ),
  },
  build: {
    // The backend expects a folder literally named `build`, not Vite's default `dist`.
    outDir: 'build',
  },
});
