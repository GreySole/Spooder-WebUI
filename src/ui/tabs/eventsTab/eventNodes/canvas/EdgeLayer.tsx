import React from 'react';
import { EventGraphEdge } from '../../../../Types';
import { colorForPort, EXEC_COLOR } from './portColors';
import { ConnectionDraftState } from './useConnectionDraft';
import { NodePortLayout, portGraphOffset } from './nodeLayout';
import { Point } from './types';

interface EdgeLayerProps {
  edges: EventGraphEdge[];
  nodePositions: Map<string, Point>;
  nodeLayouts: Map<string, NodePortLayout>;
  selectedEdgeId: string;
  // An edge whose loose end the user is currently dragging: it still exists in the graph (the
  // removal is only committed on drop) but the draft wire stands in for it on screen.
  hiddenEdgeId: string;
  onSelectEdge: (edgeId: string) => void;
  draft: ConnectionDraftState | null;
}

// Only one edge is selected at a time, so a single id is enough - the def is emitted inside
// that edge's own group and moves with it.
const SELECTED_EDGE_GRADIENT_ID = 'graph-selected-edge';

function bezierPath(from: Point, to: Point): string {
  const dx = Math.max(Math.abs(to.x - from.x) / 2, 40);
  const c1 = { x: from.x + dx, y: from.y };
  const c2 = { x: to.x - dx, y: to.y };
  return `M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
}

function endpoint(
  nodeId: string,
  portId: string,
  side: 'in' | 'out',
  nodePositions: Map<string, Point>,
  nodeLayouts: Map<string, NodePortLayout>,
): Point | undefined {
  const nodePosition = nodePositions.get(nodeId);
  const layout = nodeLayouts.get(nodeId);
  if (!nodePosition || !layout) {
    return undefined;
  }
  const entry = (side === 'in' ? layout.inputs : layout.outputs).find((p) => p.portId === portId);
  if (!entry) {
    return undefined;
  }
  const offset = portGraphOffset(entry, side);
  return { x: nodePosition.x + offset.x, y: nodePosition.y + offset.y };
}

export default function EdgeLayer(props: EdgeLayerProps) {
  const { edges, nodePositions, nodeLayouts, selectedEdgeId, hiddenEdgeId, onSelectEdge, draft } = props;

  return (
    // Explicit width/height (rather than 0, which this absolutely-positioned/no-viewBox SVG
    // would otherwise resolve to) is required for Chromium to paint children at all, even
    // though overflow:visible means nothing is actually clipped to this box. maxWidth:'none'
    // defeats this app's global `svg { max-width: 100% }` reset, which would otherwise clamp
    // that explicit width back down to 0 (the width of this svg's unsized absolute-position ancestors).
    <svg
      width={20000}
      height={20000}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible',
        pointerEvents: 'none',
        maxWidth: 'none',
      }}
    >
      {edges.map((edge) => {
        if (edge.id === hiddenEdgeId) {
          return null;
        }
        const from = endpoint(edge.fromNode, edge.fromPort, 'out', nodePositions, nodeLayouts);
        const to = endpoint(edge.toNode, edge.toPort, 'in', nodePositions, nodeLayouts);
        if (!from || !to) {
          return null;
        }
        const sourceLayout = nodeLayouts.get(edge.fromNode);
        const sourcePort = sourceLayout?.outputs.find((p) => p.portId === edge.fromPort);
        // Undefined dataType means an exec-flow port (the single default 'exec' output, or
        // one of a branching node's named ports like 'then'/'else') - same convention PortSocket
        // itself uses, rather than comparing portId against the literal string 'exec'.
        const color = sourcePort?.dataType ? colorForPort(sourcePort.dataType) : EXEC_COLOR;
        const selected = edge.id === selectedEdgeId;
        const d = bezierPath(from, to);
        return (
          <g key={edge.id} style={{ pointerEvents: 'auto', cursor: 'pointer' }} onPointerDown={(e) => { e.stopPropagation(); onSelectEdge(edge.id); }}>
            {/* Matches the selected node's gradient ring, in the theme's two analogous colors.
                Laid out in user space along the wire's own endpoints rather than the default
                bounding box, which collapses - and takes the stroke with it - whenever an edge
                happens to run perfectly level. */}
            {selected ? (
              <defs>
                <linearGradient
                  id={SELECTED_EDGE_GRADIENT_ID}
                  gradientUnits='userSpaceOnUse'
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                >
                  <stop offset='0%' stopColor='var(--color-analogous-cw, #f1c40f)' />
                  <stop offset='100%' stopColor='var(--color-analogous-ccw, #f1c40f)' />
                </linearGradient>
              </defs>
            ) : null}
            <path d={d} stroke='transparent' strokeWidth={12} fill='none' />
            <path
              d={d}
              stroke={selected ? `url(#${SELECTED_EDGE_GRADIENT_ID})` : color}
              strokeWidth={selected ? 3 : 2}
              fill='none'
            />
          </g>
        );
      })}
      {draft && (() => {
        const from = endpoint(draft.fromNodeId, draft.fromPortId, 'out', nodePositions, nodeLayouts);
        if (!from) {
          return null;
        }
        const color = draft.dataType ? colorForPort(draft.dataType) : EXEC_COLOR;
        return (
          <path
            d={bezierPath(from, draft.cursor)}
            stroke={color}
            strokeWidth={2}
            strokeDasharray='6 4'
            fill='none'
          />
        );
      })()}
    </svg>
  );
}
