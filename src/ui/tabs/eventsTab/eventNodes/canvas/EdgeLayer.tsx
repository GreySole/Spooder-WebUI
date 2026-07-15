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
  onSelectEdge: (edgeId: string) => void;
  draft: ConnectionDraftState | null;
}

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
  const { edges, nodePositions, nodeLayouts, selectedEdgeId, onSelectEdge, draft } = props;

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
        const from = endpoint(edge.fromNode, edge.fromPort, 'out', nodePositions, nodeLayouts);
        const to = endpoint(edge.toNode, edge.toPort, 'in', nodePositions, nodeLayouts);
        if (!from || !to) {
          return null;
        }
        const isExec = edge.fromPort === 'exec' && edge.toPort === 'exec';
        const sourceLayout = nodeLayouts.get(edge.fromNode);
        const sourcePort = sourceLayout?.outputs.find((p) => p.portId === edge.fromPort);
        const color = isExec ? EXEC_COLOR : colorForPort(sourcePort?.dataType);
        const selected = edge.id === selectedEdgeId;
        const d = bezierPath(from, to);
        return (
          <g key={edge.id} style={{ pointerEvents: 'auto', cursor: 'pointer' }} onPointerDown={(e) => { e.stopPropagation(); onSelectEdge(edge.id); }}>
            <path d={d} stroke='transparent' strokeWidth={12} fill='none' />
            <path
              d={d}
              stroke={selected ? '#f1c40f' : color}
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
