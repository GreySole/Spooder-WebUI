import {
  ActionNodeDef,
  EventGraphNode,
  KeyedObject,
  NodeForm,
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
  // True for a node built from a plugin's events-form.json. Plugin nodes have no bespoke
  // inspector of their own, so their `code` fields are edited there at full height instead of
  // in the card's 56px scroll box - see fieldEditedInInspector in canvas/nodeLayout.ts.
  isPluginNode?: boolean;
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

// `${name}` placeholders in a Template node's text become that node's input ports, one per
// distinct name in first-appearance order.
//
// The pattern is duplicated from the backend's TemplateUtil rather than shared, because the
// WebUI can't import backend code and this has to re-derive the ports as the user types - the
// same arrangement search_match's slots already use. Keep the two in step.
const TEMPLATE_SLOT_PATTERN = /\$\{([A-Za-z0-9_]+)\}/g;

// Unlike the OSC/Chat arg ports, these ids are the placeholder names, not positions - here the
// name is the identity. Positional ids would mean swapping `${a} ${b}` to `${b} ${a}` silently
// swapped which wire feeds which slot, which is far worse than renaming a placeholder dropping
// the wire that fed its old name.
function buildTemplateForm(baseForm: NodeForm, values: KeyedObject | undefined): NodeForm {
  const form: NodeForm = { ...baseForm };
  const template = String(values?.template ?? '');
  for (const match of template.matchAll(TEMPLATE_SLOT_PATTERN)) {
    const slot = match[1];
    // A placeholder named after the template field itself would bind a slot control to the
    // template's own form key and edit the text it came from.
    if (form[slot]) {
      continue;
    }
    form[slot] = { label: slot, type: 'text', portType: 'string' };
  }
  return form;
}

// Discord's interaction nodes offer one label field and one execution branch per button, grown
// from a `buttonCount` on the node - the same arrangement as the OSC trigger's args, for the
// same reason: only the graph knows how many there are.
//
// Ids are positional ('button0'), never the label. The backend sends them as the interaction's
// customId and branches on them coming back, and an edge persists `fromPort` - so a
// label-derived id would drop the wire the moment someone reworded a button. Keep the ceiling
// and the naming in step with MAX_BUTTONS and interactionButtons() in the Discord module.
const MAX_INTERACTION_BUTTONS = 25;
const INTERACTION_NODE_TYPES = ['interaction_send', 'interaction_send_dm'];

function interactionButtonCount(values: KeyedObject | undefined): number {
  const declared = Number(values?.buttonCount ?? 0);
  if (!Number.isFinite(declared)) {
    return 0;
  }
  return Math.min(Math.max(Math.floor(declared), 0), MAX_INTERACTION_BUTTONS);
}

// The four styles Discord allows on a clickable button. Link and Premium are absent because
// neither carries a customId, so neither can be one of these. Duplicated from BUTTON_STYLES in
// the Discord module rather than shared - the WebUI can't import backend code, the same
// arrangement the template slot pattern already uses. Keep the two in step.
const BUTTON_STYLE_SELECTIONS = {
  primary: 'Primary (blurple)',
  secondary: 'Secondary (grey)',
  success: 'Success (green)',
  danger: 'Danger (red)',
};

// Inserted straight after the count that produced them, so the labels read as belonging to it
// rather than trailing the wait at the bottom of the card. Each button is two rows: what it
// says, and what colour it is.
function buildInteractionForm(baseForm: NodeForm, values: KeyedObject | undefined): NodeForm {
  const count = interactionButtonCount(values);
  const form: NodeForm = {};
  for (const [fieldName, field] of Object.entries(baseForm)) {
    form[fieldName] = field;
    if (fieldName !== 'buttonCount') {
      continue;
    }
    for (let i = 0; i < count; i++) {
      // Both edited in the inspector: the card keeps a labelled row for each - the label field
      // has a socket, and both are worth reading at a glance - but draws a one-line preview
      // instead of a control, which is roughly half the height per button.
      form[`button${i}`] = {
        label: `Button ${i + 1}`,
        type: 'text',
        portType: 'string',
        editInInspector: true,
      };
      // No portType: a style is a fixed choice from four, not something worth wiring, and a
      // wire would only be able to feed it one of the same four strings.
      form[`button${i}Style`] = {
        label: `Button ${i + 1} Style`,
        type: 'select',
        options: { selections: BUTTON_STYLE_SELECTIONS },
        editInInspector: true,
      };
    }
  }
  return form;
}

function buildInteractionExecOutputs(
  baseExecOutputs: { id: string; label: string }[] | undefined,
  values: KeyedObject | undefined,
): { id: string; label: string }[] {
  const count = interactionButtonCount(values);
  const buttons = Array.from({ length: count }, (_unused, i) => ({
    id: `button${i}`,
    // Mirrors the fallback the backend sends to Discord for an unnamed slot, so the branch on
    // the card is labelled with whatever the button will actually say.
    label: String(values?.[`button${i}`] ?? '').trim() || `Button ${i + 1}`,
  }));
  // Buttons first, so the branches read in the order they appear on the message and the
  // timeout sits under them as the fallthrough it is.
  return [...buttons, ...(baseExecOutputs ?? [])];
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
    // Both Discord interaction nodes grow the other way round from the triggers above: their
    // buttons are inputs and branches rather than data outputs, but the count is still the
    // node's own.
    const isInteraction =
      node.moduleName === 'discord' && INTERACTION_NODE_TYPES.includes(node.nodeTypeId);
    return (
      def && {
        label: def.label,
        description: def.description,
        nodeWidth: def.nodeWidth,
        form: isInteraction ? buildInteractionForm(def.form, node.values) : def.form,
        defaults: def.defaults,
        outputs: def.outputs ?? [],
        execOutputs: isInteraction
          ? buildInteractionExecOutputs(def.execOutputs, node.values)
          : def.execOutputs,
        isPluginNode: manifests?.find((m) => m.moduleName === node.moduleName)?.isPlugin === true,
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
  // Template grows the other way round: its inputs come from the text written in it, so the
  // form gains a field - and therefore a socket - per placeholder.
  const form = def.id === 'template' ? buildTemplateForm(def.form, node.values) : def.form;
  return {
    label: def.label,
    description: def.description,
    nodeWidth: def.nodeWidth,
    form,
    defaults: def.defaults,
    outputs,
  };
}
