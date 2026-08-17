import { modules } from '../../../../../modules/registry';
import type { ModulePluginInput } from '../../../../../modules/types';

// Plugin settings field types owned by modules ('obs', 'discord'), collected from whichever
// modules are actually installed. Importing a module's component directly from here would be
// a build error the moment that submodule isn't cloned - the registry is generated from what
// exists on disk, so going through it is what keeps an uninstalled module survivable.
const registry: { [type: string]: ModulePluginInput } = {};

for (const m of modules) {
  for (const [type, input] of Object.entries(m.pluginInputs ?? {})) {
    registry[type] = input;
  }
}

// Undefined means no installed module claims this type: either the plugin's manifest has a
// typo, or the module that provides the field isn't installed.
export function getModulePluginInput(type: string): ModulePluginInput | undefined {
  return registry[type];
}
