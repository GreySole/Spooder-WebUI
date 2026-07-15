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

export type SocketKind = 'in' | 'out';

export interface ConnectionDraft {
  fromNodeId: string;
  fromPortId: string;
  kind: SocketKind;
  cursor: Point;
}
