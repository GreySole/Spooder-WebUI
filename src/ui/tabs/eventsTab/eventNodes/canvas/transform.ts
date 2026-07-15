import { Point, Transform } from './types';

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 2.0;

export function clampScale(scale: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}

export function screenToGraph(transform: Transform, screenPoint: Point): Point {
  return {
    x: (screenPoint.x - transform.x) / transform.scale,
    y: (screenPoint.y - transform.y) / transform.scale,
  };
}

// Zooms so that the graph point currently under `screenPoint` stays under it after the zoom.
export function zoomAtPoint(transform: Transform, screenPoint: Point, wheelDeltaY: number): Transform {
  const graphPoint = screenToGraph(transform, screenPoint);
  const nextScale = clampScale(transform.scale * Math.pow(1.0015, -wheelDeltaY));
  return {
    scale: nextScale,
    x: screenPoint.x - graphPoint.x * nextScale,
    y: screenPoint.y - graphPoint.y * nextScale,
  };
}

interface FitBounds {
  position: Point;
}

const DEFAULT_NODE_SIZE = { width: 200, height: 90 };

// One-shot replacement for ReactFlow's `fitView`: bounding box of node positions -> a
// transform that centers and scales that box to fit the viewport, with padding.
export function computeFitTransform(
  nodes: FitBounds[],
  viewportSize: { width: number; height: number },
  padding = 60,
): Transform {
  if (nodes.length === 0 || viewportSize.width <= 0 || viewportSize.height <= 0) {
    return { x: 0, y: 0, scale: 1 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of nodes) {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + DEFAULT_NODE_SIZE.width);
    maxY = Math.max(maxY, node.position.y + DEFAULT_NODE_SIZE.height);
  }

  const boundsWidth = Math.max(maxX - minX, 1);
  const boundsHeight = Math.max(maxY - minY, 1);
  const availableWidth = Math.max(viewportSize.width - padding * 2, 1);
  const availableHeight = Math.max(viewportSize.height - padding * 2, 1);

  const scale = clampScale(Math.min(availableWidth / boundsWidth, availableHeight / boundsHeight, 1));

  const boundsCenterX = minX + boundsWidth / 2;
  const boundsCenterY = minY + boundsHeight / 2;

  return {
    scale,
    x: viewportSize.width / 2 - boundsCenterX * scale,
    y: viewportSize.height / 2 - boundsCenterY * scale,
  };
}
