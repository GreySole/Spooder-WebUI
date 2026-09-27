export interface Point {
  x: number;
  y: number;
}

// Screen-pixel offset of the world origin (x, y) plus the current zoom factor (scale).
export interface Transform {
  x: number;
  y: number;
  scale: number;
}

// Local replacement for @xyflow/react's `Connection` shape.
export interface PendingConnection {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}

// Where a canvas context menu was summoned from. The two coordinate spaces are both needed:
// the menu is placed in container pixels, while the node it adds is dropped in graph space.
export interface ContextMenuAnchor {
  // Relative to the graph container's top-left.
  screen: Point;
  graph: Point;
  // The graph container's size, so the menu can keep itself inside it.
  viewport: { width: number; height: number };
  // The node the menu was summoned on, if any: the menu offers actions on that node as well
  // as the palette.
  nodeId?: string;
}

export type SocketKind = 'in' | 'out';

export interface ConnectionDraft {
  fromNodeId: string;
  fromPortId: string;
  kind: SocketKind;
  cursor: Point;
}
