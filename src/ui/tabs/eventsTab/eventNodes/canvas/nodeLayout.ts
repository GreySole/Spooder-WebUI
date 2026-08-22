import { EventGraphNodeKind, KeyedObject, NodeFieldDef, NodePortDataType } from '../../../../Types';
import { customFieldKey } from '../customFieldRenderer';
import { ResolvedNodeDef } from '../nodeDefLookup';
import { fieldSatisfiesShowif, growableFieldVisible } from '../nodeFieldVisibility';

// Node cards render at a declared width rather than hugging content, so every socket's screen
// offset can be computed analytically from graph data alone - no DOM measurement/ResizeObserver
// needed to keep edges tracking nodes during drag/pan/zoom. GraphNodeCard gives the header/
// title a matching fixed height and renders field rows at these same `top`/`height` values
// (instead of normal document flow) so a row and its socket dot always land on the same pixel,
// however many rows a node has and whatever control each row draws.
//
// The width is per node rather than global: the user can drag a card wider (stored as the
// node's own `width`), and a node type can ask for more room up front via its `nodeWidth` -
// which is how a plugin whose event draws an asset preview gets a card it fits on. Only the
// horizontal geometry varies; row heights and socket tops are unaffected by it.
export const NODE_WIDTH = 280;
// Narrow enough that a card of labels stays readable, wide enough that its controls don't
// collapse; the ceiling only exists so a runaway drag can't produce a card the size of the graph.
export const MIN_NODE_WIDTH = 180;
export const MAX_NODE_WIDTH = 900;
// The card's own horizontal padding, applied on both sides of every field/output row.
export const CARD_PADDING_X = 12;
export const HEADER_HEIGHT = 22;
export const TITLE_HEIGHT = 34;
export const HANDLE_TOP_START = HEADER_HEIGHT + TITLE_HEIGHT + 10;
export const HANDLE_SPACING = 18;
const EXEC_TOP = 18;

// Each field row is `label + (optional control)`. The control heights below are fixed by
// contract, not measured: GraphNodeCard renders every control into a box of exactly this
// height (with overflow hidden), so the DOM can never drift from this math and detach edges
// from their sockets. Adjusting a control's real size means adjusting it here too.
export const FIELD_LABEL_HEIGHT = HANDLE_SPACING;
const FIELD_ROW_GAP = 6;
// Paired with the `.node-inline-field` rules in common/css/app/EventTab.scss, which force
// controls to 26px: these values are that height plus a little breathing room.
const CONTROL_HEIGHTS: { [fieldType: string]: number } = {
  boolean: 28,
  color: 60,
  select: 40,
  text: 50,
  number: 50,
  code: 56, // matches COMPACT_EDITOR_HEIGHT in FormCodeInput
  // FormAssetSelect, totalled: its ASSET_PREVIEW_HEIGHT (100) preview box, the 6px margin under
  // it, a ~30px picker, and the 6px margin under that (both margins in assetInput.scss). Those
  // margins are load-bearing rather than decorative - a row clips to exactly this height, so
  // without them the picker's bottom border, and the focus ring the library draws 4px outside
  // it, are cut off. The preview box is drawn whether or not an asset is picked (it doubles as
  // the upload/drop target), so this is one number rather than depending on the field's value.
  asset: 100 + 6 + 30 + 18,
};

// A code field the inspector owns still gets a row on the card, but only a single dimmed line
// of its current value - enough to tell two plugin nodes apart without opening either.
export const CODE_PREVIEW_HEIGHT = 20;

// Whether this field's editor lives in the inspector rather than on the card.
//
// Two kinds of field qualify. A `textarea` always does: it holds a paragraph - a prompt, a
// template - and no card row is tall enough to write one in. A `code` field does when it
// belongs to a plugin node: a plugin's events-form.json can declare one (an alert's message, an
// AI prompt), those are written rather than glanced at, and the card's 56px scroll box is too
// small to work in. Plugin nodes are also the only ones with no bespoke inspector of their own,
// so moving the editor there conflicts with nothing. Core and module code fields (the Response
// node's script, Discord's message) keep their inline editors, since their inspectors already
// carry other controls for the same node.
//
// The editor is moved rather than duplicated: two controls bound to one form key would derive
// the same DOM id from it, which breaks label/input association - see NodeInspector.
export function fieldEditedInInspector(field: NodeFieldDef, isPluginNode?: boolean): boolean {
  return field.type === 'textarea' || (field.type === 'code' && isPluginNode === true);
}

// The width a node's card draws at: the user's own resize wins, then the node type's declared
// default, then the standard width. Clamped so neither a stored value nor a plugin's
// events-form.json can produce a card that can't be read or can't be dragged back.
export function clampNodeWidth(width: number): number {
  return Math.min(MAX_NODE_WIDTH, Math.max(MIN_NODE_WIDTH, Math.round(width)));
}

export function resolveNodeWidth(nodeWidth?: number, defWidth?: number): number {
  const width = Number.isFinite(nodeWidth)
    ? nodeWidth!
    : Number.isFinite(defWidth)
      ? defWidth!
      : NODE_WIDTH;
  return clampNodeWidth(width);
}

// 'custom' isn't in CONTROL_HEIGHTS: a module-supplied component states its own height when
// it registers (see fieldRenderers.ts), since nothing in the manifest describes how tall it
// draws. An unregistered component key falls back to the text-input height, matching the
// labelled text input NodeFieldInput renders in that case.
function inlineControlHeight(
  field: NodeFieldDef,
  moduleName: string,
  customFieldHeight?: (key: string) => number | undefined,
): number | undefined {
  if (field.type === 'port') {
    // Wire-only: the row is its label and its socket, with nothing to draw between them.
    return undefined;
  }
  if (field.type === 'custom') {
    return customFieldHeight?.(customFieldKey(moduleName, field)) ?? CONTROL_HEIGHTS.text;
  }
  return CONTROL_HEIGHTS[field.type];
}

export interface FieldRowLayout {
  fieldName: string;
  field: NodeFieldDef;
  top: number; // row's top edge, relative to the card
  height: number;
  // False when the value comes from a wire, the field is showif-hidden, or the type has no
  // inline control - the row collapses to just its label.
  showsControl: boolean;
  // The card draws a read-only preview here instead of a control, because the real editor is
  // in the inspector. See fieldEditedInInspector.
  previewOnly?: boolean;
}

export interface PortLayoutEntry {
  portId: string; // 'exec' for execution-flow ports, otherwise a form field id or output port id
  top: number;
  dataType?: NodePortDataType; // undefined => exec port
  label?: string; // set for named/branching exec ports so the card can show which is which
}

export interface OutputRowLayout {
  portId: string;
  label: string;
  dataType?: NodePortDataType;
  top: number; // row's top edge, relative to the card
  height: number;
  // Path under the node's values for a user-assignable type (see ResolvedPortDef); when set
  // the card draws a type picker beneath the label, and the row is sized for it.
  typeValuePath?: string[];
  // A named execution branch rather than a data output: its socket is an exec socket, and it
  // carries no value to read out beside the label.
  isExec?: boolean;
  // Informational only - the row has no socket, because nothing can wire to it yet.
  readOnly?: boolean;
}

export interface NodePortLayout {
  inputs: PortLayoutEntry[];
  outputs: PortLayoutEntry[];
  fieldRows: FieldRowLayout[];
  outputRows: OutputRowLayout[];
}

export interface NodeLayoutContext {
  // The node's current form values, for evaluating each field's `showif`.
  values?: KeyedObject;
  // Field ids fed by an incoming data edge; their controls are hidden.
  connectedInputPorts?: Set<string>;
  // Set for nodes whose fields are owned by a bespoke inspector panel: rows collapse to
  // labels so the card doesn't render a second control bound to the same form key. See
  // BESPOKE_EDITOR_CORE_NODES in coreNodeDefs.ts.
  inlineControlsDisabled?: boolean;
  // The node's module, needed to resolve a custom field's registered renderer height.
  moduleName?: string;
  // Injected rather than imported so this module stays free of React/component imports and
  // remains a pure, testable function of graph data. NodeGraphCanvas supplies the registry's
  // lookup (see fieldRenderers.ts).
  customFieldHeight?: (key: string) => number | undefined;
}

export function computeNodePortLayout(
  kind: EventGraphNodeKind,
  def: ResolvedNodeDef | undefined,
  context: NodeLayoutContext = {},
): NodePortLayout {
  const {
    values = {},
    connectedInputPorts,
    inlineControlsDisabled,
    moduleName = '',
    customFieldHeight,
  } = context;
  const inputs: PortLayoutEntry[] = [];
  const outputs: PortLayoutEntry[] = [];

  if (kind === 'action') {
    inputs.push({ portId: 'exec', top: EXEC_TOP });
  }
  if (kind === 'callback') {
    outputs.push({ portId: 'exec', top: EXEC_TOP });
  }
  // EXEC_TOP puts a socket in the header/title band, where there is no room for a label beside
  // it - fine for the single unnamed exec output every other action has, which is a bare dot.
  // Named branches ('then'/'else') each need their label drawn, so they're laid out as rows in
  // the output band below instead; see the outputRows block.
  const namedExecOutputs = kind === 'action' ? (def?.execOutputs ?? []) : [];
  if (kind === 'action' && namedExecOutputs.length === 0) {
    outputs.push({ portId: 'exec', top: EXEC_TOP });
  }

  // Walk every visible field in declaration order, accumulating variable row heights. A row
  // is emitted for each field (so non-port fields are visible on the card too), but only
  // fields with a portType get a socket pushed into `inputs` - keeping EdgeLayer's port
  // lookups working exactly as before. The socket aligns to the row's label line, not its
  // control, so a dot always sits beside its field name.
  const fieldRows: FieldRowLayout[] = [];
  let rowTop = HANDLE_TOP_START - FIELD_LABEL_HEIGHT / 2;
  for (const [fieldName, field] of Object.entries(def?.form ?? {})) {
    if (!fieldSatisfiesShowif(field.showif, values)) {
      continue;
    }
    // A growing node (Concat) only draws the slots it has grown into, so its card - and every
    // socket offset below this point - stays as short as the node actually is.
    if (!growableFieldVisible(fieldName, field, def?.form, values, connectedInputPorts)) {
      continue;
    }
    const editedInInspector = fieldEditedInInspector(field, def?.isPluginNode);
    const controlHeight =
      inlineControlsDisabled || connectedInputPorts?.has(fieldName)
        ? undefined
        : editedInInspector
          ? CODE_PREVIEW_HEIGHT
          : inlineControlHeight(field, moduleName, customFieldHeight);
    const height = FIELD_LABEL_HEIGHT + (controlHeight ?? 0);

    fieldRows.push({
      fieldName,
      field,
      top: rowTop,
      height,
      showsControl: controlHeight !== undefined,
      previewOnly: editedInInspector,
    });
    if (field.portType) {
      inputs.push({
        portId: fieldName,
        top: rowTop + FIELD_LABEL_HEIGHT / 2,
        dataType: field.portType,
      });
    }
    rowTop += height + FIELD_ROW_GAP;
  }

  // The executor resolves both operation-node outputs (computed) and callback-node outputs
  // (read live off the trigger payload/StreamMessage) as wireable data sources - see
  // EventGraphExecutor's resolveNodeValues. Action-node outputs aren't wired up there yet, so
  // those get a row but no socket (`readOnly` below).
  //
  // Outputs continue below the field rows rather than restarting at HANDLE_TOP_START: the OSC
  // trigger has both (address/argCount fields plus its arg outputs), and sharing that band
  // would overlap them - which is the same collision named exec branches used to cause by
  // being drawn in document flow instead of from this layout.
  const outputRows: OutputRowLayout[] = [];
  // Same accumulator style as the field rows: an output whose type the user assigns (the
  // OSC trigger's args) needs room for its picker, so the stride can't be fixed.
  let outputTop = fieldRows.length ? rowTop : HANDLE_TOP_START - FIELD_LABEL_HEIGHT / 2;

  // Branch labels first, so they read as the continuation of the field that decides them
  // ('Condition' -> 'Then' -> 'Else') rather than sitting above their own input.
  for (const port of namedExecOutputs) {
    outputRows.push({
      portId: port.id,
      label: port.label,
      top: outputTop,
      height: FIELD_LABEL_HEIGHT,
      isExec: true,
    });
    outputs.push({ portId: port.id, top: outputTop + FIELD_LABEL_HEIGHT / 2, label: port.label });
    outputTop += FIELD_LABEL_HEIGHT;
  }

  if (kind === 'operation' || kind === 'callback') {
    for (const output of def?.outputs ?? []) {
      const controlHeight = output.typeValuePath ? CONTROL_HEIGHTS.select : 0;
      const height = FIELD_LABEL_HEIGHT + controlHeight;

      outputRows.push({
        portId: output.id,
        label: output.label,
        dataType: output.dataType,
        top: outputTop,
        height,
        typeValuePath: output.typeValuePath,
      });
      outputs.push({
        portId: output.id,
        top: outputTop + FIELD_LABEL_HEIGHT / 2,
        dataType: output.dataType,
      });
      outputTop += height + (controlHeight ? FIELD_ROW_GAP : 0);
    }
  } else if (kind === 'action') {
    // An action node's data outputs aren't resolved by the executor yet, so they get a row to
    // sit on but no socket - the card labels them as not wireable.
    for (const output of def?.outputs ?? []) {
      outputRows.push({
        portId: output.id,
        label: output.label,
        dataType: output.dataType,
        top: outputTop,
        height: FIELD_LABEL_HEIGHT,
        readOnly: true,
      });
      outputTop += FIELD_LABEL_HEIGHT;
    }
  }

  return { inputs, outputs, fieldRows, outputRows };
}

// A card's drawn height: the lowest thing on it plus one row of breathing room. GraphNodeCard
// renders exactly this as its min-height, and box selection hit-tests against it, so the two
// can't disagree about how tall a node is.
export function nodeCardHeight(layout: NodePortLayout): number {
  const rowBottoms = [...layout.fieldRows, ...layout.outputRows].map((r) => r.top + r.height);
  const lowest = Math.max(
    HEADER_HEIGHT + TITLE_HEIGHT,
    ...rowBottoms,
    ...layout.inputs.map((p) => p.top),
    ...layout.outputs.map((p) => p.top),
  );
  return lowest + HANDLE_SPACING;
}

// `width` is the card's resolved width (see resolveNodeWidth): output sockets hang off its right
// edge, so an edge endpoint moves with a resize while input endpoints stay put.
export function portGraphOffset(
  entry: PortLayoutEntry,
  side: 'in' | 'out',
  width: number = NODE_WIDTH,
): { x: number; y: number } {
  return { x: side === 'in' ? 0 : width, y: entry.top };
}
