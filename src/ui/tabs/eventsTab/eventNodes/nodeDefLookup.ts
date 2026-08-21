import {
  ActionNodeDef,
  EventGraphNode,
  KeyedObject,
  NodeManifest,
  NodePortDataType,
  NodePortDef,
  OperationNodeDef,
  TriggerNodeDef,
  TriggerTestDef,
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
  // The card width this node type asks for, before the user's own resize. Undefined means the
  // standard NODE_WIDTH - see resolveNodeWidth.
  nodeWidth?: number;
  // Named exec output ports for branching actions (e.g. 'then'/'else'). Undefined/empty
  // means the node has the usual single unlabeled 'exec' output.
  execOutputs?: { id: string; label: string }[];
  // Carried through from a trigger def so the inspector can offer this node's test panel.
  test?: TriggerTestDef;
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
): ResolvedPortDef[] {
  const patternWords = String(values?.pattern ?? '')
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

// A chat command's arguments are whatever follows it, so nothing but the user can say how many
// to expose - same situation as the OSC trigger's argCount, and the same answer. Ids are
// positional, so raising or lowering the count can't disturb the wires below it.
function buildCommandArgOutputs(
  baseOutputs: NodePortDef[],
  values: KeyedObject | undefined,
): ResolvedPortDef[] {
  const argCount = Number(values?.argCount ?? 0);
  const count = Number.isFinite(argCount) ? Math.max(0, Math.floor(argCount)) : 0;
  return [
    ...baseOutputs,
    ...Array.from({ length: count }, (_unused, i) => ({
      id: `arg${i}`,
      label: `Arg ${i}`,
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
    // Two triggers grow ports from their own values: the OSC trigger's args from argCount, and
    // the Chat Command trigger's from the same field. The executor resolves both off whatever
    // fired the event.
    const outputs =
      node.moduleName === 'core' && node.nodeTypeId === 'osc_trigger'
        ? buildOscTriggerOutputs(node.values)
        : node.nodeTypeId === 'chat_command'
          ? buildCommandArgOutputs(def.outputs, node.values)
          : def.outputs;
    return {
      label: def.label,
      description: def.description,
      nodeWidth: def.nodeWidth,
      form: def.form,
      defaults: def.defaults,
      outputs,
      test: def.test,
    };
  }
  if (node.kind === 'action') {
    const def = findActionDef(manifests, node.moduleName, node.nodeTypeId);
    return (
      def && {
        label: def.label,
        description: def.description,
        nodeWidth: def.nodeWidth,
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
  // Two operation nodes grow ports from their own values, the way the OSC trigger grows args:
  // Search & Match one per pattern word, Chat Command one per declared argument. Both resolve
  // straight out of what evaluate() returns for the node.
  let outputs = def.outputs;
  if (def.id === 'search_match') {
    outputs = buildSearchMatchOutputs(def.outputs, node.values);
  } else if (def.id === 'command_match') {
    outputs = buildCommandArgOutputs(def.outputs, node.values);
  }
  return {
    label: def.label,
    description: def.description,
    nodeWidth: def.nodeWidth,
    form: def.form,
    defaults: def.defaults,
    outputs,
  };
}
