import type { ModuleDefinition } from '@spooder/webui-module-sdk';
import { loadRemote, registerRemotes } from '@module-federation/runtime';
import { recordModuleFailure, registerModule, setActiveModules } from './registry';

// What the backend reports for each module UI it has installed and is serving.
interface RemoteModuleInfo {
  key: string;
  // URL of the remote's mf-manifest.json, under the path the backend static-serves it from.
  url: string;
  version?: string;
}

// Remotes are registered at runtime rather than listed in the build config, because the host
// cannot know which modules are installed until it asks. This is the whole reason the loader
// exists: a module is installed by dropping its built output on the server, with no rebuild of
// the WebUI.
/**
 * Asks the backend which modules it has loaded, so a module compiled into this bundle but no
 * longer installed stops showing a tab. Left unknown if the backend cannot answer - an older
 * Spooder has no such route, and hiding every tab would be worse than showing a stale one.
 */
export async function syncActiveModules(): Promise<void> {
  try {
    const response = await fetch('/module/loaded');
    if (!response.ok) {
      return;
    }
    const loaded = await response.json();
    if (Array.isArray(loaded)) {
      setActiveModules(loaded);
    }
  } catch (e) {
    console.warn('Could not ask which modules are loaded; showing all of them.', e);
  }
}

export default async function loadRemoteModules(): Promise<void> {
  let installed: RemoteModuleInfo[];
  try {
    const response = await fetch('/module/ui');
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
    installed = await response.json();
  } catch (e) {
    // An older backend has no /module/ui, and a WebUI built with its modules bundled does not
    // need one. Neither is worth failing the app over - it just means no remotes.
    console.warn('Could not list module UIs; loading none.', e);
    return;
  }

  if (!Array.isArray(installed) || installed.length === 0) {
    return;
  }

  registerRemotes(
    installed.map((m) => ({ name: m.key, entry: m.url })),
    // Re-registering the same name is a no-op rather than a throw, which matters if this ever
    // runs twice (a reconnect, a hot reload).
    { force: false },
  );

  // Settled, not all: one module failing to load must not cost the others their tabs.
  const results = await Promise.allSettled(
    installed.map(async (m) => {
      const loaded = await loadRemote<{ default: ModuleDefinition }>(`${m.key}/module`);
      if (!loaded?.default) {
        throw new Error(`${m.key} exposed no module definition`);
      }
      registerModule(loaded.default);
    }),
  );

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      // Usually a shared-dependency mismatch: the module was built against an SDK range this
      // host no longer satisfies. Recorded as well as logged, because a module that fails here
      // never gets a tab - without this it would be invisible rather than broken.
      console.error(`Module '${installed[i].key}' failed to load:`, result.reason);
      recordModuleFailure(
        installed[i].key,
        result.reason?.message ?? String(result.reason ?? 'Unknown error'),
      );
    }
  });
}
