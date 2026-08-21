import React from 'react';
import { modules } from '../../../../modules/registry';
import { ModuleNodeTestPanelProps } from '../../../../modules/types';

// The test panel a module supplies for its own trigger nodes, one per module.
//
// Unlike moduleNodeInspectors.ts this isn't keyed by node type: which nodes are testable is
// already declared on the backend, as `test` on the trigger def, so keying it here as well
// would be a second list to keep in step with the first. The inspector asks for a module's
// panel only for a node whose def carries `test`.
const registry: { [moduleName: string]: React.ComponentType<ModuleNodeTestPanelProps> } = {};

for (const m of modules) {
  if (m.nodeTestPanel) {
    registry[m.key] = m.nodeTestPanel;
  }
}

export function getModuleNodeTestPanel(
  moduleName: string,
): React.ComponentType<ModuleNodeTestPanelProps> | undefined {
  return registry[moduleName];
}
