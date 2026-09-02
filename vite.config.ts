import { federation } from '@module-federation/vite';
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
  // Installed module UIs, served by the backend out of user/modules. Listed explicitly rather
  // than leaning on '/module' happening to be a string prefix of it.
  '/modules',
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

export default defineConfig(({ command }) => ({
  // Keep the node_modules symlink to the module SDK unresolved. Following it rewrites imports
  // to the package's real path inside this repo, and Vite will not serve that URL - a nested
  // package.json is a dependency boundary it only serves under /node_modules or /@fs.
  resolve: { preserveSymlinks: true },
  // Without this the SDK is pre-bundled into node_modules/.vite/deps, and editing it during
  // development does nothing until Vite re-optimises. Excluded, it is served as source and
  // hot reloads like the rest of the app - which is the whole reason it lives in this repo
  // rather than being consumed from npm.
  optimizeDeps: { exclude: ['@spooder/webui-module-sdk'] },
  plugins: [
    react(),
    // Federation is a build-time concern here, and turning it on in dev actively breaks the
    // dev server: the plugin rewrites every shared import to a loader pointing at the module
    // SDK's real path, `/module-sdk/src/index.ts`, which Vite refuses to serve - a nested
    // package.json is a dependency boundary it only serves under /node_modules or /@fs.
    //
    // Nothing is lost by skipping it. In development the modules are checked out under
    // src/modules/installed and compiled straight into the bundle, so there are no remotes for
    // a share scope to negotiate with.
    //
    // This is the host half of the setup. It exposes nothing - modules never import from the
    // host - but it declares the same shared libraries the modules do, because those are built
    // with `import: false` and carry no fallback copy. A library shared by a module but not
    // named here cannot resolve at runtime, and that module fails to load.
    ...(command === 'build'
      ? federation({
          name: 'spooder_webui',
          remotes: {},
          shared: {
            react: { singleton: true, requiredVersion: '^18.0.0' },
            'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
            'react-redux': { singleton: true },
            '@reduxjs/toolkit': { singleton: true },
            'react-hook-form': { singleton: true },
            '@spooder/webui-component-library': { singleton: true },
            '@spooder/webui-module-sdk': { singleton: true, requiredVersion: '^0.6.0' },
          },
        })
      : []),
  ],
  server: {
    port: 3001,
    proxy: Object.fromEntries(
      apiPrefixes.map((prefix) => [prefix, { target: 'http://localhost:3001', changeOrigin: true }]),
    ),
  },
  build: {
    // The backend expects a folder literally named `build`, not Vite's default `dist`.
    outDir: 'build',
    // Federation's runtime uses top-level await, same as the module builds.
    target: 'esnext',
  },
}));
