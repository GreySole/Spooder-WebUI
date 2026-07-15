import React, { useCallback, useRef } from 'react';
import { GraphViewportProvider } from './GraphViewportContext';
import { Point, Transform } from './types';
import { useCanvasPanZoom } from './useCanvasPanZoom';

interface GraphViewportProps {
  transform: Transform;
  onTransformChange: (next: Transform) => void;
  onBackgroundClick?: () => void;
  children: React.ReactNode;
}

const CLICK_MOVE_THRESHOLD = 4;

export default function GraphViewport(props: GraphViewportProps) {
  const { transform, onTransformChange, onBackgroundClick, children } = props;
  const viewportRef = useRef<HTMLDivElement>(null);
  const panZoom = useCanvasPanZoom(transform, onTransformChange, viewportRef);

  const clickStart = useRef<Point | null>(null);
  const moved = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).dataset.canvasBackground) {
        clickStart.current = { x: e.clientX, y: e.clientY };
        moved.current = false;
      }
      panZoom.onPointerDown(e);
    },
    [panZoom],
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
      panZoom.onPointerMove(e);
    },
    [panZoom],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      panZoom.onPointerUp(e);
      if (clickStart.current && !moved.current) {
        onBackgroundClick?.();
      }
      clickStart.current = null;
    },
    [panZoom, onBackgroundClick],
  );

  return (
    <div
      ref={viewportRef}
      data-canvas-background='true'
      onWheel={panZoom.onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: 'none',
        cursor: panZoom.isPanning ? 'grabbing' : 'default',
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
      </div>
    </div>
  );
}
