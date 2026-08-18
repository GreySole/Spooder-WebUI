import {
  ActionNodeDef,
  EventGraphNode,
  KeyedObject,
  NodeManifest,
  NodePortDataType,
  NodePortDef,
  OperationNodeDef,
  TriggerNodeDef,
} from '../../../Types';
import { CORE_ACTION_DEFS, CORE_TRIGGER_DEFS } from './coreNodeDefs';

export interface ResolvedPortDef extends NodePortDef {
  // When set, this output's data type is chosen by the user rather than fixed by the node
  // definition. The path is relative to the node's `values` (e.g. ['argTypes', '0']) so the
  // node card can build the form key itself - resolveNodeDef has the node but not its index.
  typeValuePath?: string[];
}

export interface ResolvedNodeDef {
  label: string;
  description?: string;
  form: { [fieldName: string]: any };
  defaults: { [key: string]: any };
  outputs: ResolvedPortDef[];
  // Named exec output ports for branching actions (e.g. 'then'/'else'). Undefined/empty
  // means the node has the usual single unlabeled 'exec' output.
  execOutputs?: { id: string; label: string }[];
}

export function findTriggerDef(
  manifests: NodeManifest[] | undefined,
  moduleName: string,
  nodeTypeId: string,
): TriggerNodeDef | undefined {
  // The backend's own 'core' manifest wins when it declares the node type; CORE_TRIGGER_DEFS
  // is only a fallback for the handful of legacy core triggers the backend doesn't register
  // (they have bespoke inspector editors instead of the generic NodeForm renderer).
  const manifest = manifests?.find((m) => m.moduleName === moduleName);
  const fromManifest = manifest?.triggers.find((t) => t.id === nodeTypeId);
  if (fromManifest) {
    return fromManifest;
  }
  return moduleName === 'core' ? CORE_TRIGGER_DEFS.find((d) => d.id === nodeTypeId) : undefined;
}

export function findActionDef(
  manifests: NodeManifest[] | undefined,
  moduleName: string,
  nodeTypeId: string,
): ActionNodeDef | undefined {
  // Same precedence as findTriggerDef: backend manifest first, CORE_ACTION_DEFS only as a
  // fallback for the legacy bespoke-editor core actions the backend doesn't declare.
  const manifest = manifests?.find((m) => m.moduleName === moduleName);
  const fromManifest = manifest?.actions.find((a) => a.id === nodeTypeId);
  if (fromManifest) {
    return fromManifest;
  }
  return moduleName === 'core' ? CORE_ACTION_DEFS.find((d) => d.id === nodeTypeId) : undefined;
}

export function findOperationDef(
  operationNodes: OperationNodeDef[] | undefined,
  nodeTypeId: string,
): OperationNodeDef | undefined {
  return operationNodes?.find((o) => o.id === nodeTypeId);
}

// The OSC trigger's outputs depend on the node's own `argCount`, not on a static manifest
// entry: an OSC message is just an address plus an arbitrary arg array, so the user declares
// how many args this address sends and optionally names/types them.
//
// Port ids are always `arg0`..`argN-1` and never derived from the user's label - edges persist
// `fromPort` by id, so a label-derived id would silently break every existing wire on rename.
function buildOscTriggerOutputs(values: KeyedObject | undefined): ResolvedPortDef[] {
  const outputs: ResolvedPortDef[] = [{ id: 'address', label: 'Address', dataType: 'string' }];
  const argCount = Number(values?.argCount ?? 0);
  const labels: string[] = values?.argLabels ?? [];
  const types: NodePortDataType[] = values?.argTypes ?? [];

  for (let i = 0; i < argCount; i++) {
    outputs.push({
      id: `arg${i}`,
      label: labels[i] || `Arg ${i}`,
      dataType: types[i] || 'any',
      // An OSC message carries no type information, so the user declares each arg's type
      // directly on the node - this points the card's type picker at the right value.
      typeValuePath: ['argTypes', String(i)],
    });
  }
  return outputs;
}

// A search-and-match trigger's pattern is a sequence of word slots ('hello * >w me|too'), and
// firing it fills one slot per word - literal words included - into the match array the
// executor exposes as this node's `match0`..`matchN-1` ports. The slots therefore come from the
// pattern the user typed, the same way the OSC trigger's args come from its argCount.
//
// Ids stay positional rather than derived from the pattern word, so editing the pattern can't
// silently break a wire (same rule as the OSC arg ports).
function buildSearchMatchOutputs(
  baseOutputs: NodePortDef[],
  values: KeyedObject | undefined,
  // The trigger keys its pattern as `command` (the slot the runtime reads a chat trigger's text
  // from); the operation node, with no such history, calls it `pattern`.
  patternKey: 'command' | 'pattern',
): ResolvedPortDef[] {
  const patternWords = String(values?.[patternKey] ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return [
    ...baseOutputs,
    ...patternWords.map((word, i) => ({
      id: `match${i}`,
      label: `Match ${i}: ${word}`,
      dataType: 'string' as NodePortDataType,
    })),
  ];
}

export function resolveNodeDef(
  node: Pick<EventGraphNode, 'kind' | 'moduleName' | 'nodeTypeId' | 'values'>,
  manifests: NodeManifest[] | undefined,
  operationNodes: OperationNodeDef[] | undefined,
): ResolvedNodeDef | undefined {
  if (node.kind === 'callback') {
    const def = findTriggerDef(manifests, node.moduleName, node.nodeTypeId);
    if (!def) {
      return undefined;
    }
    // 'chat_search' is matched by nodeTypeId alone, not moduleName: any stream module can
    // contribute one (see reconstructFlatEventFromGraph on the backend, which routes them the
    // same way).
    const outputs =
      node.moduleName === 'core' && node.nodeTypeId === 'osc_trigger'
        ? buildOscTriggerOutputs(node.values)
        : node.nodeTypeId === 'chat_search'
          ? buildSearchMatchOutputs(def.outputs, node.values, 'command')
          : def.outputs;
    return { label: def.label, description: def.description, form: def.form, defaults: def.defaults, outputs };
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
        execOutputs: def.execOutputs,
      }
    );
  }
  const def = findOperationDef(operationNodes, node.nodeTypeId);
  if (!def) {
    return undefined;
  }
  // Search & Match grows a Match port per pattern word, exactly as the trigger does - here the
  // ports resolve straight out of what evaluate() returns for the node.
  const outputs =
    def.id === 'search_match' ? buildSearchMatchOutputs(def.outputs, node.values, 'pattern') : def.outputs;
  return { label: def.label, description: def.description, form: def.form, defaults: def.defaults, outputs };
}
