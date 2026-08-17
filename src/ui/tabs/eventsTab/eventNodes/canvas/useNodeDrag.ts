import { useCallback, useRef, useState } from 'react';
import { Point } from './types';

export interface NodeDragState {
  nodeId: string;
  position: Point;
}

const MOVE_THRESHOLD = 2;

// Single active node drag (no multi-select). Live position updates stay in local state only;
// the form is only touched once, on pointerup, and only if the node actually moved - so a plain
// click on a node header doesn't spuriously dirty the form.
export function useNodeDrag(scale: number, onDragEnd: (nodeId: string, position: Point) => void) {
  const [dragState, setDragState] = useState<NodeDragState | null>(null);
  const startScreen = useRef<Point>({ x: 0, y: 0 });
  const startPosition = useRef<Point>({ x: 0, y: 0 });
  const activeNodeId = useRef<string | null>(null);
  const moved = useRef(false);

  const startDrag = useCallback(
    (e: React.PointerEvent, nodeId: string, currentPosition: Point, captureTarget: Element | null) => {
      // Left button only - a right press on a card opens the node context menu instead.
      if (e.button !== 0) {
        return;
      }
      e.stopPropagation();
      // Suppresses the browser's native text-selection gesture, which pointerdown would
      // otherwise begin: as the drag sweeps the pointer across the card it would select the
      // labels and the text inside the inline inputs. `user-select: none` on the labels can't
      // prevent this on its own, because the selection is driven by the drag gesture itself
      // and inputs carry their own selectable text.
      e.preventDefault();
      // Pointer capture keeps drag tracking correct if the cursor briefly leaves the element
      // during a fast move, but isn't load-bearing for the drag itself (events still bubble to
      // this handler's owner normally) - a capture failure shouldn't abort the drag.
      try {
        captureTarget?.setPointerCapture(e.pointerId);
      } catch {
        // ignore - see comment above
      }
      startScreen.current = { x: e.clientX, y: e.clientY };
      startPosition.current = currentPosition;
      activeNodeId.current = nodeId;
      moved.current = false;
      setDragState({ nodeId, position: currentPosition });
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!activeNodeId.current) {
        return;
      }
      const dxScreen = e.clientX - startScreen.current.x;
      const dyScreen = e.clientY - startScreen.current.y;
      if (Math.hypot(dxScreen, dyScreen) > MOVE_THRESHOLD) {
        moved.current = true;
      }
      const dx = dxScreen / scale;
      const dy = dyScreen / scale;
      setDragState({
        nodeId: activeNodeId.current,
        position: { x: startPosition.current.x + dx, y: startPosition.current.y + dy },
      });
    },
    [scale],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!activeNodeId.current) {
        return;
      }
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore - see startDrag
      }
      const nodeId = activeNodeId.current;
      const wasMoved = moved.current;
      setDragState((current) => {
        if (current && wasMoved) {
          onDragEnd(nodeId, current.position);
        }
        return null;
      });
      activeNodeId.current = null;
    },
    [onDragEnd],
  );

  return { dragState, startDrag, onPointerMove, onPointerUp };
}
