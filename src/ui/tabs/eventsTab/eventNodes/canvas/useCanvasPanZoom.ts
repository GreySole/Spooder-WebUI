import { useCallback, useEffect, useRef, useState } from 'react';
import { Point, Transform } from './types';
import { distanceBetween, midpointOf, pinchTransform, zoomAtPoint } from './transform';

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
  // Published so the gestures owned by other hooks (a node drag, a wire, a marquee) can stand
  // down when a second finger arrives - whichever of them the first finger happened to start.
  const [isPinching, setIsPinching] = useState(false);
  const panStartScreen = useRef<Point>({ x: 0, y: 0 });
  const panStartTransform = useRef<Transform>(transform);
  // Every touch currently down on the viewport, and the gesture the second one started.
  const touches = useRef(new Map<number, Point>());
  const pinch = useRef<{ distance: number; center: Point; transform: Transform } | null>(null);
  // The pinch listeners are registered once and read the transform from here, rather than being
  // torn down and rebuilt on every frame of the gesture they are themselves driving.
  const latestTransform = useRef(transform);
  latestTransform.current = transform;

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

  // Pinch-to-zoom, for touch only - a trackpad pinch already arrives as ctrl+wheel and is
  // handled above. Registered natively in the capture phase rather than through React's props
  // because a finger landing on a node card is stopPropagation'd by the card's own drag handler,
  // and the gesture has to see both fingers wherever they land.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const toLocal = (e: PointerEvent): Point => {
      const rect = viewport.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    function onDown(e: PointerEvent) {
      if (e.pointerType !== 'touch') {
        return;
      }
      touches.current.set(e.pointerId, toLocal(e));
      if (touches.current.size !== 2) {
        return;
      }
      const [a, b] = [...touches.current.values()];
      pinch.current = {
        distance: distanceBetween(a, b) || 1,
        center: midpointOf(a, b),
        transform: latestTransform.current,
      };
      // The first finger may have started a pan, a node drag or a wire; the second finger takes
      // the gesture over from all of them.
      setIsPanning(false);
      setIsPinching(true);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== 'touch' || !touches.current.has(e.pointerId)) {
        return;
      }
      touches.current.set(e.pointerId, toLocal(e));
      const gesture = pinch.current;
      if (!gesture || touches.current.size < 2) {
        return;
      }
      const [a, b] = [...touches.current.values()];
      onTransformChange(
        pinchTransform(
          gesture.transform,
          gesture.center,
          midpointOf(a, b),
          distanceBetween(a, b) / gesture.distance,
        ),
      );
    }

    function onUp(e: PointerEvent) {
      if (!touches.current.delete(e.pointerId)) {
        return;
      }
      // Ends the gesture rather than handing the zoom back to the remaining finger, which would
      // otherwise jump the canvas as it became a one-finger pan mid-motion.
      if (touches.current.size < 2) {
        pinch.current = null;
        setIsPinching(false);
      }
    }

    viewport.addEventListener('pointerdown', onDown, true);
    viewport.addEventListener('pointermove', onMove, true);
    viewport.addEventListener('pointerup', onUp, true);
    viewport.addEventListener('pointercancel', onUp, true);
    return () => {
      viewport.removeEventListener('pointerdown', onDown, true);
      viewport.removeEventListener('pointermove', onMove, true);
      viewport.removeEventListener('pointerup', onUp, true);
      viewport.removeEventListener('pointercancel', onUp, true);
    };
  }, [onTransformChange, viewportRef]);

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
    if (!isPanning || pinch.current) {
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

  return { onWheel, onPointerDown, onPointerMove, onPointerUp, isPanning, isPinching };
}
