import type { ModuleDefinition } from '@spooder/webui-module-sdk';
import { getModules } from './registry';

/**
 * Builds a lookup over the installed modules, rebuilding it only when the set of modules
 * actually changes.
 *
 * These lookups used to be plain module-scope constants, which is what stopped a module
 * loading after first paint from ever appearing in one. Deferring the build is the fix;
 * memoising on the registry's snapshot - whose identity changes only on registration - is what
 * keeps a per-render call from rebuilding the map on every node the graph draws.
 */
export default function memoByModules<T>(
  build: (modules: readonly ModuleDefinition[]) => T,
): () => T {
  let cache: T;
  let builtFrom: readonly ModuleDefinition[] | null = null;
  return () => {
    const modules = getModules();
    if (builtFrom !== modules) {
      cache = build(modules);
      builtFrom = modules;
    }
    return cache;
  };
}
