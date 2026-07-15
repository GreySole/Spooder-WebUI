import {
  ActionNodeDef,
  EventGraphNode,
  NodeManifest,
  NodePortDef,
  OperationNodeDef,
  TriggerNodeDef,
} from '../../../Types';
import { CORE_ACTION_DEFS, CORE_TRIGGER_DEFS } from './coreNodeDefs';

export interface ResolvedNodeDef {
  label: string;
  description?: string;
  form: { [fieldName: string]: any };
  defaults: { [key: string]: any };
  outputs: NodePortDef[];
}

export function findTriggerDef(
  manifests: NodeManifest[] | undefined,
  moduleName: string,
  nodeTypeId: string,
): TriggerNodeDef | undefined {
  if (moduleName === 'core') {
    return CORE_TRIGGER_DEFS.find((d) => d.id === nodeTypeId);
  }
  const manifest = manifests?.find((m) => m.moduleName === moduleName);
  return manifest?.triggers.find((t) => t.id === nodeTypeId);
}

export function findActionDef(
  manifests: NodeManifest[] | undefined,
  moduleName: string,
  nodeTypeId: string,
): ActionNodeDef | undefined {
  if (moduleName === 'core') {
    return CORE_ACTION_DEFS.find((d) => d.id === nodeTypeId);
  }
  const manifest = manifests?.find((m) => m.moduleName === moduleName);
  return manifest?.actions.find((a) => a.id === nodeTypeId);
}

export function findOperationDef(
  operationNodes: OperationNodeDef[] | undefined,
  nodeTypeId: string,
): OperationNodeDef | undefined {
  return operationNodes?.find((o) => o.id === nodeTypeId);
}

export function resolveNodeDef(
  node: Pick<EventGraphNode, 'kind' | 'moduleName' | 'nodeTypeId'>,
  manifests: NodeManifest[] | undefined,
  operationNodes: OperationNodeDef[] | undefined,
): ResolvedNodeDef | undefined {
  if (node.kind === 'callback') {
    const def = findTriggerDef(manifests, node.moduleName, node.nodeTypeId);
    return def && { label: def.label, description: def.description, form: def.form, defaults: def.defaults, outputs: def.outputs };
  }
  if (node.kind === 'action') {
    const def = findActionDef(manifests, node.moduleName, node.nodeTypeId);
    return (
      def && {
        label: def.label,
        description: def.description,
        form: def.form,
        defaults: def.defaults,
        outputs: def.outputs ?? [],
      }
    );
  }
  const def = findOperationDef(operationNodes, node.nodeTypeId);
  return def && { label: def.label, description: def.description, form: def.form, defaults: def.defaults, outputs: def.outputs };
}
