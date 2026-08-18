import React, { useCallback, useRef } from 'react';
import { GraphViewportProvider } from './GraphViewportContext';
import { Point, Transform } from './types';
import { BoxSelectRect, useBoxSelect } from './useBoxSelect';
import { useCanvasPanZoom } from './useCanvasPanZoom';

interface GraphViewportProps {
  transform: Transform;
  onTransformChange: (next: Transform) => void;
  onBackgroundClick?: () => void;
  // Fires when a selection box is released, with the rectangle in graph space. The viewport
  // owns the gesture rather than the canvas inside it because a background drag captures the
  // pointer on this element - captured moves retarget here and never reach the content.
  onBoxSelect?: (rect: BoxSelectRect, additive: boolean) => void;
  children: React.ReactNode;
}

const CLICK_MOVE_THRESHOLD = 4;

// Shift or ctrl turns a left press on empty canvas into a selection box instead of a pan. Both
// modifiers work: ctrl is the reflex for most node editors, shift for most canvas apps, and
// neither means anything else here.
function isBoxSelectGesture(e: React.PointerEvent<HTMLDivElement>): boolean {
  const target = e.target as HTMLElement;
  return e.button === 0 && Boolean(target.dataset.canvasBackground) && (e.shiftKey || e.ctrlKey);
}

export default function GraphViewport(props: GraphViewportProps) {
  const { transform, onTransformChange, onBackgroundClick, onBoxSelect, children } = props;
  const viewportRef = useRef<HTMLDivElement>(null);
  const panZoom = useCanvasPanZoom(transform, onTransformChange, viewportRef);
  const boxSelect = useBoxSelect(transform, viewportRef, (rect, additive) =>
    onBoxSelect?.(rect, additive),
  );

  const clickStart = useRef<Point | null>(null);
  const moved = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (onBoxSelect && isBoxSelectGesture(e)) {
        // Deliberately not tracked as a background click: releasing a box that selected nothing
        // is the user's own "select nothing", not a stray click that should clear on top of it.
        boxSelect.start(e, viewportRef.current);
        return;
      }
      // Left button only: a middle press is a pan (which ends wherever it ends) and a right
      // press opens the node menu - neither should count as a click that clears the selection.
      if (e.button === 0 && (e.target as HTMLElement).dataset.canvasBackground) {
        clickStart.current = { x: e.clientX, y: e.clientY };
        moved.current = false;
      }
      panZoom.onPointerDown(e);
    },
    [panZoom, boxSelect, onBoxSelect],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (clickStart.current) {
        const dx = e.clientX - clickStart.current.x;
        const dy = e.clientY - clickStart.current.y;
        if (Math.hypot(dx, dy) > CLICK_MOVE_THRESHOLD) {
          moved.current = true;
        }
      }
      boxSelect.onPointerMove(e);
      panZoom.onPointerMove(e);
    },
    [panZoom, boxSelect],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      boxSelect.onPointerUp(e);
      panZoom.onPointerUp(e);
      if (clickStart.current && !moved.current) {
        onBackgroundClick?.();
      }
      clickStart.current = null;
    },
    [panZoom, boxSelect, onBackgroundClick],
  );

  return (
    <div
      ref={viewportRef}
      data-canvas-background='true'
      onWheel={panZoom.onWheel}
      // Middle click's own default actions have no place on a canvas that pans with it: on
      // Linux it pastes the primary selection into whatever inline field is underneath, which
      // would edit a node just for panning past it.
      onAuxClick={(e) => {
        if (e.button === 1) {
          e.preventDefault();
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={boxSelect.cancel}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: 'none',
        cursor: panZoom.isPanning ? 'grabbing' : boxSelect.rect ? 'crosshair' : 'default',
        background: 'var(--color-background, #1e1e1e)',
      }}
    >
      <div
        data-canvas-background='true'
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transformOrigin: '0 0',
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
      >
        <GraphViewportProvider value={{ transform, viewportRef }}>{children}</GraphViewportProvider>
        {boxSelect.rect ? (
          <div
            style={{
              position: 'absolute',
              left: boxSelect.rect.x,
              top: boxSelect.rect.y,
              width: boxSelect.rect.width,
              height: boxSelect.rect.height,
              // Drawn inside the transformed layer so it stays pinned to the graph, which means
              // undoing the zoom on the border to keep it a hairline at any scale.
              border: `${1 / transform.scale}px dashed var(--color-analogous-cw, #f1c40f)`,
              background: 'color-mix(in srgb, var(--color-analogous-ccw, #f1c40f) 12%, transparent)',
              pointerEvents: 'none',
              zIndex: 6,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
