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

// A module that fails to load has no ModuleDefinition, so it has no tab and nothing on screen
// would otherwise mention it - it simply would not appear, which looks identical to never
// having installed it. Recorded here so the Modules tab can say what happened.
export interface ModuleLoadFailure {
  key: string;
  message: string;
}

const failures: ModuleLoadFailure[] = [];
let failureSnapshot: readonly ModuleLoadFailure[] = [];

export function getModuleFailures(): readonly ModuleLoadFailure[] {
  return failureSnapshot;
}

export function recordModuleFailure(key: string, message: string) {
  if (failures.some((f) => f.key === key)) {
    return;
  }
  failures.push({ key, message });
  failureSnapshot = [...failures];
  listeners.forEach((listener) => listener());
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
/**
 * Drops a module from the registry, so its tab goes away the moment it is uninstalled rather
 * than lingering until the next restart.
 *
 * The module's injected reducer and middleware stay on the store - RTK has no clean way to
 * remove them, and a slice nothing reads is harmless. The tab is what the user sees.
 */
export function unregisterModule(key: string): boolean {
  const index = registered.findIndex((m) => m.key === key);
  if (index === -1) {
    return false;
  }
  registered.splice(index, 1);
  snapshot = [...registered];
  listeners.forEach((listener) => listener());
  return true;
}

export function registerModule(definition: ModuleDefinition): boolean {
  if (registered.some((m) => m.key === definition.key)) {
    return false;
  }
  registered.push(definition);
  snapshot = [...registered];
  listeners.forEach((listener) => listener());
  return true;
}
