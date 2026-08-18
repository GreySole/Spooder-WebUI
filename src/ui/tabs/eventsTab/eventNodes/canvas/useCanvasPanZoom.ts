import { useCallback, useRef, useState } from 'react';
import { Point, Transform } from './types';
import { zoomAtPoint } from './transform';

// Pan-to-drag + zoom-to-cursor handlers for a `GraphViewport`. The transform is controlled by
// the caller (NodeGraphCanvas) so that a one-shot fit-to-view can set it directly without this
// hook needing to expose an imperative API.
// Which presses pan:
//  - middle button, wherever the cursor is, including on top of a node card. It's the one
//    gesture that never has to compete with what's underneath it.
//  - left button on empty canvas, unmodified. Holding shift/ctrl hands the same press to box
//    selection instead (see useBoxSelect), and a right press belongs to the node context menu -
//    panning from either would leave the canvas drifting under an open menu or a marquee.
function canPan(e: React.PointerEvent<HTMLDivElement>): boolean {
  if (e.button === 1) {
    return true;
  }
  const target = e.target as HTMLElement;
  return e.button === 0 && Boolean(target.dataset.canvasBackground) && !e.shiftKey && !e.ctrlKey;
}

export function useCanvasPanZoom(
  transform: Transform,
  onTransformChange: (next: Transform) => void,
  viewportRef: React.RefObject<HTMLDivElement>,
) {
  const [isPanning, setIsPanning] = useState(false);
  const panStartScreen = useRef<Point>({ x: 0, y: 0 });
  const panStartTransform = useRef<Transform>(transform);

  const toViewportPoint = useCallback(
    (e: { clientX: number; clientY: number }): Point => {
      const rect = viewportRef.current?.getBoundingClientRect();
      return { x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) };
    },
    [viewportRef],
  );

  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const screenPoint = toViewportPoint(e);
      onTransformChange(zoomAtPoint(transform, screenPoint, e.deltaY));
    },
    [transform, onTransformChange, toViewportPoint],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canPan(e)) {
        return;
      }
      // Stops Chrome's middle-click autoscroll from taking over the gesture (preventing the
      // pointerdown default suppresses the compatibility mousedown that triggers it).
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      panStartScreen.current = { x: e.clientX, y: e.clientY };
      panStartTransform.current = transform;
      setIsPanning(true);
    },
    [transform],
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) {
      return;
    }
    const dx = e.clientX - panStartScreen.current.x;
    const dy = e.clientY - panStartScreen.current.y;
    onTransformChange({
      ...panStartTransform.current,
      x: panStartTransform.current.x + dx,
      y: panStartTransform.current.y + dy,
    });
  }, [isPanning, onTransformChange]);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) {
      return;
    }
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setIsPanning(false);
  }, [isPanning]);

  return { onWheel, onPointerDown, onPointerMove, onPointerUp, isPanning };
}
