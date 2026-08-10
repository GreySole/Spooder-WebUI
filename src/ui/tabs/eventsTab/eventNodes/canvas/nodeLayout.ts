import { EventGraphNodeKind, NodePortDataType } from '../../../../Types';
import { ResolvedNodeDef } from '../nodeDefLookup';

// Node cards render at a fixed width rather than hugging content, so every socket's screen
// offset can be computed analytically from graph data alone - no DOM measurement/ResizeObserver
// needed to keep edges tracking nodes during drag/pan/zoom. GraphNodeCard gives the header/
// title a matching fixed height and renders port labels at these same `top` values (instead
// of normal document flow) so a label row and its socket dot always land on the same pixel,
// however many rows a node has.
export const NODE_WIDTH = 190;
export const HEADER_HEIGHT = 22;
export const TITLE_HEIGHT = 34;
export const HANDLE_TOP_START = HEADER_HEIGHT + TITLE_HEIGHT + 10;
export const HANDLE_SPACING = 18;
const EXEC_TOP = 18;

export interface PortLayoutEntry {
  portId: string; // 'exec' for execution-flow ports, otherwise a form field id or output port id
  top: number;
  dataType?: NodePortDataType; // undefined => exec port
  label?: string; // set for named/branching exec ports so the card can show which is which
}

export interface NodePortLayout {
  inputs: PortLayoutEntry[];
  outputs: PortLayoutEntry[];
}

export function computeNodePortLayout(
  kind: EventGraphNodeKind,
  def: ResolvedNodeDef | undefined,
): NodePortLayout {
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

  const portFields = Object.entries(def?.form ?? {}).filter(([, field]) => field.portType);
  portFields.forEach(([fieldName, field], i) => {
    inputs.push({ portId: fieldName, top: HANDLE_TOP_START + i * HANDLE_SPACING, dataType: field.portType });
  });

  // The executor resolves both operation-node outputs (computed) and callback-node outputs
  // (read live off the trigger payload/StreamMessage) as wireable data sources - see
  // EventGraphExecutor's resolveNodeValues. Action-node outputs aren't wired up there yet,
  // so those still render as read-only text (see GraphNodeCard's readOnlyOutputs).
  if (kind === 'operation' || kind === 'callback') {
    (def?.outputs ?? []).forEach((output, i) => {
      outputs.push({ portId: output.id, top: HANDLE_TOP_START + i * HANDLE_SPACING, dataType: output.dataType });
    });
  }

  return { inputs, outputs };
}

export function portGraphOffset(entry: PortLayoutEntry, side: 'in' | 'out'): { x: number; y: number } {
  return { x: side === 'in' ? 0 : NODE_WIDTH, y: entry.top };
}
