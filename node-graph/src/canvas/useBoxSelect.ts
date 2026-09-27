import { useCallback, useRef, useState } from 'react';
import { screenToGraph } from './transform';
import { Point, Transform } from './types';

export interface BoxSelectRect {
  // Graph space, already normalized so width/height are never negative - the marquee can be
  // dragged in any direction.
  x: number;
  y: number;
  width: number;
  height: number;
}

// How a completed marquee changes the existing selection: 'replace' swaps it outright (even to
// empty, on a box that hit nothing), 'add' unions the nodes it touched into what's already
// picked, 'subtract' removes them from it.
export type BoxSelectMode = 'replace' | 'add' | 'subtract';

// Drag a rectangle across empty canvas to select every node it touches. Kept in graph space
// rather than screen space so the marquee and the hit test read the same coordinates the nodes
// are stored in, with no per-frame conversion.
export function useBoxSelect(
  transform: Transform,
  viewportRef: React.RefObject<HTMLDivElement>,
  onComplete: (rect: BoxSelectRect, mode: BoxSelectMode) => void,
) {
  const [rect, setRect] = useState<BoxSelectRect | null>(null);
  const origin = useRef<{ point: Point; mode: BoxSelectMode; pointerId: number } | null>(null);

  const toGraphPoint = useCallback(
    (e: { clientX: number; clientY: number }): Point => {
      const bounds = viewportRef.current?.getBoundingClientRect();
      return screenToGraph(transform, {
        x: e.clientX - (bounds?.left ?? 0),
        y: e.clientY - (bounds?.top ?? 0),
      });
    },
    [transform, viewportRef],
  );

  // Anchors the marquee at `press`'s position. Takes a plain {clientX, clientY, pointerId}
  // rather than a live React.PointerEvent so a right-drag can be promoted into a marquee from
  // GraphViewport's pointermove, once it clears the click threshold, while still anchoring at
  // the original mousedown point rather than wherever the threshold happened to be crossed.
  const start = useCallback(
    (
      press: { clientX: number; clientY: number; pointerId: number },
      captureTarget: Element | null,
      mode: BoxSelectMode,
    ) => {
      try {
        captureTarget?.setPointerCapture(press.pointerId);
      } catch {
        // A capture failure shouldn't abort the gesture - events still bubble normally.
      }
      const point = toGraphPoint(press);
      origin.current = { point, mode, pointerId: press.pointerId };
      setRect({ x: point.x, y: point.y, width: 0, height: 0 });
    },
    [toGraphPoint],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const from = origin.current;
      if (!from || e.pointerId !== from.pointerId) {
        return;
      }
      const to = toGraphPoint(e);
      setRect({
        x: Math.min(from.point.x, to.x),
        y: Math.min(from.point.y, to.y),
        width: Math.abs(to.x - from.point.x),
        height: Math.abs(to.y - from.point.y),
      });
    },
    [toGraphPoint],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const from = origin.current;
      if (!from || e.pointerId !== from.pointerId) {
        return;
      }
      try {
        (e.target as Element).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore - see start
      }
      origin.current = null;
      setRect((current) => {
        if (current) {
          onComplete(current, from.mode);
        }
        return null;
      });
    },
    [onComplete],
  );

  const cancel = useCallback(() => {
    origin.current = null;
    setRect(null);
  }, []);

  return { rect, start, onPointerMove, onPointerUp, cancel };
}

// Any overlap counts, rather than requiring full containment: dragging a box across a column of
// nodes is meant to catch them, not just the ones that fit entirely inside it.
export function rectIntersectsNode(
  rect: BoxSelectRect,
  position: Point,
  size: { width: number; height: number },
): boolean {
  return (
    rect.x < position.x + size.width &&
    rect.x + rect.width > position.x &&
    rect.y < position.y + size.height &&
    rect.y + rect.height > position.y
  );
}
