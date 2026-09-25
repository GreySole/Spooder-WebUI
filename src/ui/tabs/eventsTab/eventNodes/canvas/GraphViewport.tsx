import React, { useCallback, useEffect, useRef } from 'react';
import { GraphViewportProvider } from './GraphViewportContext';
import { Point, Transform } from './types';
import { BoxSelectMode, BoxSelectRect, useBoxSelect } from './useBoxSelect';
import { useCanvasPanZoom } from './useCanvasPanZoom';

interface GraphViewportProps {
  transform: Transform;
  onTransformChange: (next: Transform) => void;
  onBackgroundClick?: () => void;
  // Fires when a selection box is released, with the rectangle in graph space. The viewport
  // owns the gesture rather than the canvas inside it because a background drag captures the
  // pointer on this element - captured moves retarget here and never reach the content.
  onBoxSelect?: (rect: BoxSelectRect, mode: BoxSelectMode) => void;
  children: React.ReactNode;
}

const CLICK_MOVE_THRESHOLD = 4;

// Alt/shift/ctrl on a left press on empty canvas turns it into a selection box instead of a
// pan - unmodified, left stays reserved for panning. Alt subtracts, shift or ctrl adds (both
// work: ctrl is the reflex for most node editors, shift for most canvas apps).
function leftBoxSelectMode(e: React.PointerEvent<HTMLDivElement>): BoxSelectMode | null {
  const target = e.target as HTMLElement;
  if (e.button !== 0 || !target.dataset.canvasBackground) {
    return null;
  }
  if (e.altKey) {
    return 'subtract';
  }
  if (e.shiftKey || e.ctrlKey) {
    return 'add';
  }
  return null;
}

// A right press on empty canvas always starts a selection box (once it's actually dragged - see
// pendingRight below), unmodified or not: unmodified it replaces the selection, same modifiers
// as the left gesture otherwise add or subtract. Kept on the right button rather than the left
// so plain left-drag can stay reserved for panning.
function rightBoxSelectMode(e: React.PointerEvent<HTMLDivElement>): BoxSelectMode | null {
  const target = e.target as HTMLElement;
  if (e.button !== 2 || !target.dataset.canvasBackground) {
    return null;
  }
  if (e.altKey) {
    return 'subtract';
  }
  if (e.shiftKey || e.ctrlKey) {
    return 'add';
  }
  return 'replace';
}

export default function GraphViewport(props: GraphViewportProps) {
  const { transform, onTransformChange, onBackgroundClick, onBoxSelect, children } = props;
  const viewportRef = useRef<HTMLDivElement>(null);
  const panZoom = useCanvasPanZoom(transform, onTransformChange, viewportRef);
  const boxSelect = useBoxSelect(transform, viewportRef, (rect, mode) =>
    onBoxSelect?.(rect, mode),
  );
  const suppressContextMenuRef = useRef(false);

  const clickStart = useRef<Point | null>(null);
  const moved = useRef(false);

  // A right press on background doesn't start the marquee immediately - a right click that
  // never clears the move threshold is meant to open the context menu, not eat the click as an
  // empty box-select. This holds the press until onPointerMove either promotes it into a real
  // drag (see there) or onPointerUp finds it was never dragged at all.
  const pendingRight = useRef<{
    clientX: number;
    clientY: number;
    pointerId: number;
    mode: BoxSelectMode;
  } | null>(null);

  // A second finger turns whatever was happening into a pinch, including a selection box the
  // first finger had started dragging.
  useEffect(() => {
    if (panZoom.isPinching) {
      boxSelect.cancel();
      pendingRight.current = null;
      clickStart.current = null;
    }
  }, [panZoom.isPinching, boxSelect]);

  // Every gesture in here preventDefault()s its own pointerdown - to stop Chrome's middle-click
  // autoscroll, to stop a node drag sweeping a text selection across the card, and so on. That
  // also suppresses the compatibility mousedown the browser uses to move focus, so a focused
  // inline field on a node would keep focus (and its caret) however far away the next click
  // landed. Blurring here puts the default behaviour back.
  //
  // Capture phase, so it can't be skipped: it runs before any child handler - the port sockets
  // stopPropagation() theirs - and before anything has had the chance to preventDefault.
  const onPointerDownCapture = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const active = document.activeElement as HTMLElement | null;
    if (!active || active === document.body) {
      return;
    }
    // A press landing inside the focused control is the user working in it, not leaving it -
    // `contains` counts the element itself, so clicking a focused select to open its list stays.
    if (active.contains(e.target as Node)) {
      return;
    }
    active.blur();
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (onBoxSelect) {
        const leftMode = leftBoxSelectMode(e);
        if (leftMode) {
          // Deliberately not tracked as a background click: releasing a box that selected
          // nothing is the user's own "select nothing", not a stray click that should clear on
          // top of it.
          e.preventDefault();
          boxSelect.start(e, viewportRef.current, leftMode);
          return;
        }
        const rightMode = rightBoxSelectMode(e);
        if (rightMode) {
          // Capture now so a fast drag can't outrun the element and lose move events, but don't
          // preventDefault - that would suppress the contextmenu event a non-drag click still
          // needs (see onPointerUp/pendingRight below).
          try {
            viewportRef.current?.setPointerCapture(e.pointerId);
          } catch {
            // ignore - see boxSelect.start
          }
          pendingRight.current = {
            clientX: e.clientX,
            clientY: e.clientY,
            pointerId: e.pointerId,
            mode: rightMode,
          };
          return;
        }
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
      const pending = pendingRight.current;
      if (pending && e.pointerId === pending.pointerId) {
        const dx = e.clientX - pending.clientX;
        const dy = e.clientY - pending.clientY;
        if (Math.hypot(dx, dy) <= CLICK_MOVE_THRESHOLD) {
          // Still within the click threshold - not a drag yet, and not a pan either.
          return;
        }
        // Promoted into a real marquee, anchored at the original press point rather than here.
        // The native contextmenu event that follows this button's eventual mouseup would open
        // the node menu on top of whatever gets selected, so it's suppressed up front.
        pendingRight.current = null;
        suppressContextMenuRef.current = true;
        boxSelect.start(pending, viewportRef.current, pending.mode);
      }
      boxSelect.onPointerMove(e);
      panZoom.onPointerMove(e);
    },
    [panZoom, boxSelect],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const pending = pendingRight.current;
      if (pending && e.pointerId === pending.pointerId) {
        // Released before clearing the drag threshold - a plain right click. Leave it alone so
        // the native contextmenu event that follows opens the node menu as usual.
        pendingRight.current = null;
        try {
          (e.target as Element).releasePointerCapture?.(e.pointerId);
        } catch {
          // ignore - see boxSelect.start
        }
        return;
      }
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
      onPointerDownCapture={onPointerDownCapture}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        pendingRight.current = null;
        boxSelect.cancel();
      }}
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
        <GraphViewportProvider
          value={{
            transform,
            viewportRef,
            isPinching: panZoom.isPinching,
            suppressContextMenuRef,
          }}
        >
          {children}
        </GraphViewportProvider>
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
