import { useSyncExternalStore } from 'react';
import { getModuleFailures, getModules, subscribeToModules } from './registry';

// Re-renders the component when a module finishes loading. Anything that draws from the module
// list - the tab bar, the tab itself, a node's field renderer - has to go through this rather
// than reading the registry once, or a module that arrives after first paint never appears.
export default function useModules() {
  return useSyncExternalStore(subscribeToModules, getModules, getModules);
}

// Modules that failed to load, for the one place in the UI that can still speak for them.
export function useModuleFailures() {
  return useSyncExternalStore(subscribeToModules, getModuleFailures, getModuleFailures);
}
