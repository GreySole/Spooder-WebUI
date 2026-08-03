import { EventGraphNodeKind, NodePortDataType } from '../../../../Types';
import { ResolvedNodeDef } from '../nodeDefLookup';

// Node cards render at a fixed width rather than hugging content, so every socket's screen
// offset can be computed analytically from graph data alone - no DOM measurement/ResizeObserver
// needed to keep edges tracking nodes during drag/pan/zoom.
export const NODE_WIDTH = 190;
const HANDLE_TOP_START = 36;
const HANDLE_SPACING = 18;
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

  // The executor only ever resolves operation-node outputs today, so only operation nodes get
  // wireable output sockets; other node kinds' outputs are rendered as read-only text.
  if (kind === 'operation') {
    (def?.outputs ?? []).forEach((output, i) => {
      outputs.push({ portId: output.id, top: HANDLE_TOP_START + i * HANDLE_SPACING, dataType: output.dataType });
    });
  }

  return { inputs, outputs };
}

export function portGraphOffset(entry: PortLayoutEntry, side: 'in' | 'out'): { x: number; y: number } {
  return { x: side === 'in' ? 0 : NODE_WIDTH, y: entry.top };
}
