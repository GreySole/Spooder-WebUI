import type { ModuleDefinition } from '@spooder/webui-module-sdk';

// Which modules are present is only known at runtime: in production they are federated remotes
// downloaded and served by the backend, and they finish loading after the app has already
// rendered. So this is a live registry rather than the generated list of static imports it used
// to be - things read from it through getModules()/useModules() and re-read when it changes,
// instead of capturing an array at import time.
const registered: ModuleDefinition[] = [];
const listeners = new Set<() => void>();

// useSyncExternalStore compares snapshots by identity and will loop forever if getSnapshot
// returns a fresh array each call, so the snapshot is rebuilt only when the registry changes.
let snapshot: readonly ModuleDefinition[] = [];

export function getModules(): readonly ModuleDefinition[] {
  return snapshot;
}

export function subscribeToModules(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Called once per module, either by the generated dev registry (source-linked modules, for
 * hot reload) or by the remote loader after a federated module resolves.
 *
 * Registering the same key twice is ignored rather than treated as an error: in development
 * both paths can be live at once, and a module that is already mounted should win over a
 * second copy of itself arriving late.
 */
export function registerModule(definition: ModuleDefinition): boolean {
  if (registered.some((m) => m.key === definition.key)) {
    return false;
  }
  registered.push(definition);
  snapshot = [...registered];
  listeners.forEach((listener) => listener());
  return true;
}
