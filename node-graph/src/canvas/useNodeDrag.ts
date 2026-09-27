import { useCallback, useRef, useState } from 'react';
import { Point } from './types';

export interface NodeDragState {
  // Live positions of every node moving in this drag, keyed by node id.
  positions: Map<string, Point>;
}

const MOVE_THRESHOLD = 2;

// One drag gesture, moving one node or the whole selection together. Live positions stay in
// local state only; the form is only touched once, on pointerup, and only if the nodes actually
// moved - so a plain click on a node doesn't spuriously dirty the form.
export function useNodeDrag(
  scale: number,
  onDragEnd: (positions: Map<string, Point>) => void,
) {
  const [dragState, setDragState] = useState<NodeDragState | null>(null);
  const startScreen = useRef<Point>({ x: 0, y: 0 });
  // Where each dragged node sat when the gesture began; every move is applied as one shared
  // delta against these, so the group keeps its shape however far the pointer travels.
  const startPositions = useRef<Map<string, Point>>(new Map());
  const dragging = useRef(false);
  // The finger or button that started the drag. Everything else is ignored, so a second touch -
  // the other half of a pinch, say - can't yank the node around.
  const pointerId = useRef<number | null>(null);
  const moved = useRef(false);

  const startDrag = useCallback(
    (e: React.PointerEvent, nodes: { id: string; position: Point }[], captureTarget: Element | null) => {
      // Left button only: a middle press is a pan gesture that may well start on top of a card.
      if (e.button !== 0 || nodes.length === 0) {
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
      pointerId.current = e.pointerId;
      startScreen.current = { x: e.clientX, y: e.clientY };
      startPositions.current = new Map(nodes.map((n) => [n.id, n.position]));
      dragging.current = true;
      moved.current = false;
      setDragState({ positions: new Map(startPositions.current) });
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || e.pointerId !== pointerId.current) {
        return;
      }
      const dxScreen = e.clientX - startScreen.current.x;
      const dyScreen = e.clientY - startScreen.current.y;
      if (Math.hypot(dxScreen, dyScreen) > MOVE_THRESHOLD) {
        moved.current = true;
      }
      const dx = dxScreen / scale;
      const dy = dyScreen / scale;
      const positions = new Map<string, Point>();
      startPositions.current.forEach((position, nodeId) => {
        positions.set(nodeId, { x: position.x + dx, y: position.y + dy });
      });
      setDragState({ positions });
    },
    [scale],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || e.pointerId !== pointerId.current) {
        return;
      }
      pointerId.current = null;
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore - see startDrag
      }
      const wasMoved = moved.current;
      dragging.current = false;
      setDragState((current) => {
        if (current && wasMoved) {
          onDragEnd(current.positions);
        }
        return null;
      });
    },
    [onDragEnd],
  );

  // Abandons the drag and puts the nodes back where they started - nothing is committed to the
  // form. Used when a second finger turns the gesture into a pinch: the node was never meant to
  // move, it just happened to be under the first finger.
  const cancel = useCallback(() => {
    dragging.current = false;
    pointerId.current = null;
    setDragState(null);
  }, []);

  return { dragState, startDrag, cancel, onPointerMove, onPointerUp };
}
