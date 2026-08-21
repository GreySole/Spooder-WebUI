import React from 'react';
import { modules } from '../../../../modules/registry';
import { ModuleNodeInspectorProps } from '../../../../modules/types';

// Inspector panels contributed by installed modules, keyed `${moduleName}.${nodeTypeId}` -
// the same registry idea as fieldRenderers.ts, for the panel rather than a single field.
//
// Core's panels stay hardwired in NodeInspector: they're part of the editor, not of an
// installable module, and each is reached by its own condition rather than a plain node-type
// match. Everything a module owns goes through here, so adding a panel to a module needs no
// edit in the events tab.
const registry: { [key: string]: React.ComponentType<ModuleNodeInspectorProps> } = {};

for (const m of modules) {
  for (const [nodeTypeId, component] of Object.entries(m.nodeInspectors ?? {})) {
    registry[`${m.key}.${nodeTypeId}`] = component;
  }
}

export function getModuleNodeInspector(
  moduleName: string,
  nodeTypeId: string,
): React.ComponentType<ModuleNodeInspectorProps> | undefined {
  return registry[`${moduleName}.${nodeTypeId}`];
}
