import type { ModuleApi, ModuleDefinition } from '@spooder/webui-module-sdk';
import { _setModuleTabs } from '../app/slice/navigationSlice';
import store, { injectModuleApi } from '../app/store';
import { getModules, subscribeToModules } from './registry';

// Everything that has to happen to the store when a module registers, in one place. The
// registry itself stays a plain list with no knowledge of Redux, so a module can be registered
// from the dev path or the remote loader without either of them knowing what wiring follows.
function asApiList(api: ModuleApi | ModuleApi[]): ModuleApi[] {
  return Array.isArray(api) ? api : [api];
}

function syncModulesToStore(modules: readonly ModuleDefinition[]) {
  // Reducer and middleware first: the tab renders as soon as the dispatch below lands, and a
  // module component that mounted before its api was injected would fire a query into a slice
  // the store has not got yet.
  for (const m of modules) {
    for (const api of asApiList(m.api)) {
      injectModuleApi(api);
    }
  }

  const main: { [key: string]: { label: string; icon: any } } = {};
  const deck: { [key: string]: { label: string; icon: any } } = {};
  for (const m of modules) {
    const tab = { label: m.tabConfig.label, icon: m.tabConfig.icon };
    // Modules sit with the decks below the divider. 'main' is the only opt-out; the legacy
    // 'module' value lands in the decks too, since the folder it nested under is gone.
    if (m.tabConfig.parentTab === 'main') {
      main[m.key] = tab;
    } else {
      deck[m.key] = tab;
    }
  }
  store.dispatch(_setModuleTabs({ main, deck }));
}

/**
 * Starts mirroring the module registry into the store, and covers anything already registered
 * by the time it runs - the dev path registers at import, before this is called.
 */
export default function startModuleBootstrap() {
  syncModulesToStore(getModules());
  subscribeToModules(() => syncModulesToStore(getModules()));
}
