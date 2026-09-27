import { useSyncExternalStore } from 'react';
import type { ModuleDefinition } from '@spooder/webui-module-sdk';

// Where the editor learns which WebUI modules are installed, for the inspectors, test panels and
// field renderers they contribute. The editor doesn't own a module registry - each app has its
// own way of loading modules - so the host hands it one, once, before the first graph renders.
export interface ModuleSource {
  getModules: () => readonly ModuleDefinition[];
  subscribe: (onChange: () => void) => () => void;
}

const NO_MODULES: readonly ModuleDefinition[] = [];
let source: ModuleSource = {
  getModules: () => NO_MODULES,
  subscribe: () => () => {},
};

export function setModuleSource(next: ModuleSource) {
  source = next;
}

export function getModules(): readonly ModuleDefinition[] {
  return source.getModules();
}

const subscribe = (onChange: () => void) => source.subscribe(onChange);

// Re-renders when a module finishes loading, so one that arrives after first paint still shows up.
export function useModules(): readonly ModuleDefinition[] {
  return useSyncExternalStore(subscribe, getModules, getModules);
}

/**
 * Builds a lookup over the installed modules, rebuilding it only when the set of modules
 * actually changes. Memoised on the source's snapshot - whose identity changes only on
 * registration - so a per-render call from every node the graph draws doesn't rebuild the map.
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
