import { EventGraphNodeKind, KeyedObject, NodeFieldDef, NodePortDataType } from '../../../../Types';
import { ResolvedNodeDef } from '../nodeDefLookup';
import { fieldSatisfiesShowif } from '../nodeFieldVisibility';

// Node cards render at a fixed width rather than hugging content, so every socket's screen
// offset can be computed analytically from graph data alone - no DOM measurement/ResizeObserver
// needed to keep edges tracking nodes during drag/pan/zoom. GraphNodeCard gives the header/
// title a matching fixed height and renders field rows at these same `top`/`height` values
// (instead of normal document flow) so a row and its socket dot always land on the same pixel,
// however many rows a node has and whatever control each row draws.
export const NODE_WIDTH = 280;
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
  color: 30,
  select: 40,
  text: 50,
  number: 50,
  asset: 60, // dropdown + upload/preview button row
  code: 56, // matches COMPACT_EDITOR_HEIGHT in FormCodeInput
};

// 'custom' is intentionally absent: those render a module-supplied component whose height
// isn't knowable from the manifest (Discord's channelSelect is a two-dropdown pair), so the
// card shows a label-only row and defers editing to the inspector pane.
function inlineControlHeight(field: NodeFieldDef): number | undefined {
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
}

export interface PortLayoutEntry {
  portId: string; // 'exec' for execution-flow ports, otherwise a form field id or output port id
  top: number;
  dataType?: NodePortDataType; // undefined => exec port
  label?: string; // set for named/branching exec ports so the card can show which is which
}

export interface NodePortLayout {
  inputs: PortLayoutEntry[];
  outputs: PortLayoutEntry[];
  fieldRows: FieldRowLayout[];
}

export interface NodeLayoutContext {
  // The node's current form values, for evaluating each field's `showif`.
  values?: KeyedObject;
  // Field ids fed by an incoming data edge; their controls are hidden.
  connectedInputPorts?: Set<string>;
}

export function computeNodePortLayout(
  kind: EventGraphNodeKind,
  def: ResolvedNodeDef | undefined,
  context: NodeLayoutContext = {},
): NodePortLayout {
  const { values = {}, connectedInputPorts } = context;
  const inputs: PortLayoutEntry[] = [];
  const outputs: PortLayoutEntry[] = [];

  if (kind === 'action') {
    inputs.push({ portId: 'exec', top: EXEC_TOP });
  }
  if (kind === 'callback') {
    outputs.push({ portId: 'exec', top: EXEC_TOP });
  }
  if (kind === 'action') {
    if (def?.execOutputs?.length) {
      def.execOutputs.forEach((port, i) => {
        outputs.push({ portId: port.id, top: EXEC_TOP + i * HANDLE_SPACING, label: port.label });
      });
    } else {
      outputs.push({ portId: 'exec', top: EXEC_TOP });
    }
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
    const controlHeight = connectedInputPorts?.has(fieldName) ? undefined : inlineControlHeight(field);
    const height = FIELD_LABEL_HEIGHT + (controlHeight ?? 0);

    fieldRows.push({ fieldName, field, top: rowTop, height, showsControl: controlHeight !== undefined });
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
  // EventGraphExecutor's resolveNodeValues. Action-node outputs aren't wired up there yet,
  // so those still render as read-only text (see GraphNodeCard's readOnlyOutputs).
  if (kind === 'operation' || kind === 'callback') {
    (def?.outputs ?? []).forEach((output, i) => {
      outputs.push({ portId: output.id, top: HANDLE_TOP_START + i * HANDLE_SPACING, dataType: output.dataType });
    });
  }

  return { inputs, outputs, fieldRows };
}

export function portGraphOffset(entry: PortLayoutEntry, side: 'in' | 'out'): { x: number; y: number } {
  return { x: side === 'in' ? 0 : NODE_WIDTH, y: entry.top };
}
