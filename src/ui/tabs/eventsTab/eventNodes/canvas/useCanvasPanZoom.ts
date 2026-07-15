import { useCallback, useRef, useState } from 'react';
import { Point, Transform } from './types';
import { zoomAtPoint } from './transform';

// Pan-to-drag + zoom-to-cursor handlers for a `GraphViewport`. The transform is controlled by
// the caller (NodeGraphCanvas) so that a one-shot fit-to-view can set it directly without this
// hook needing to expose an imperative API.
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
      const target = e.target as HTMLElement;
      if (!target.dataset.canvasBackground) {
        return;
      }
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
