import { useCallback, useRef, useState } from 'react';
import { clampNodeWidth } from './nodeLayout';

export interface NodeResizeState {
  nodeId: string;
  width: number;
}

const RESIZE_THRESHOLD = 2;

// One resize gesture, widening a single card by its right-edge handle. Same shape as
// useNodeDrag: the live width lives in local state so the card and its edges track the pointer,
// and the form is only touched on pointerup - and only if the pointer actually travelled, so
// clicking the handle doesn't dirty the form with the width it already had.
//
// Only one node resizes at a time even when several are selected: a card's width is a property
// of what it draws, not of where it sits, so there's nothing to keep in formation.
export function useNodeResize(
  scale: number,
  onResizeEnd: (nodeId: string, width: number) => void,
) {
  const [resizeState, setResizeState] = useState<NodeResizeState | null>(null);
  const startScreenX = useRef(0);
  const startWidth = useRef(0);
  const resizing = useRef(false);
  // The pointer that grabbed the handle; another finger's moves are not this gesture.
  const pointerId = useRef<number | null>(null);
  const moved = useRef(false);

  const startResize = useCallback(
    (e: React.PointerEvent, nodeId: string, width: number) => {
      if (e.button !== 0) {
        return;
      }
      // The handle sits on the card, which is a drag surface: without this the resize would
      // also move the node.
      e.stopPropagation();
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Not load-bearing - the canvas handles pointermove/up either way.
      }
      pointerId.current = e.pointerId;
      startScreenX.current = e.clientX;
      startWidth.current = width;
      resizing.current = true;
      moved.current = false;
      setResizeState({ nodeId, width });
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizing.current || e.pointerId !== pointerId.current) {
        return;
      }
      const dxScreen = e.clientX - startScreenX.current;
      if (Math.abs(dxScreen) > RESIZE_THRESHOLD) {
        moved.current = true;
      }
      // Divided by the zoom, so the card's edge stays under the cursor at any scale.
      const width = clampNodeWidth(startWidth.current + dxScreen / scale);
      setResizeState((current) => (current ? { ...current, width } : null));
    },
    [scale],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!resizing.current || e.pointerId !== pointerId.current) {
        return;
      }
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore - see startResize
      }
      const wasMoved = moved.current;
      resizing.current = false;
      setResizeState((current) => {
        if (current && wasMoved) {
          onResizeEnd(current.nodeId, current.width);
        }
        return null;
      });
    },
    [onResizeEnd],
  );

  // Drops the resize without committing the new width - see useNodeDrag.cancel.
  const cancel = useCallback(() => {
    resizing.current = false;
    pointerId.current = null;
    setResizeState(null);
  }, []);

  return { resizeState, startResize, cancel, onPointerMove, onPointerUp };
}
