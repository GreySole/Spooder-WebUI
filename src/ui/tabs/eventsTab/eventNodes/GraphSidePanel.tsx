import React, { ReactNode, useCallback, useRef, useState } from 'react';

const WIDTH_STORAGE_KEY = 'nodeGraphPanelWidth';
const DEFAULT_WIDTH = 320;
const MIN_WIDTH = 240;
// Leaves at least this much of the canvas visible however far the panel is dragged open.
const MIN_CANVAS_WIDTH = 160;

// One width for the panel slot, shared by whichever panel is in it (inspector, timer manager)
// and remembered across sessions - the modal unmounts the whole graph every time it closes, so
// without this a widened panel would snap back to 320 on the next open.
export function useGraphPanelWidth(): [number, (width: number) => void, () => void] {
  const [width, setWidth] = useState(() => {
    const stored = Number(localStorage.getItem(WIDTH_STORAGE_KEY));
    return Number.isFinite(stored) && stored >= MIN_WIDTH ? stored : DEFAULT_WIDTH;
  });
  // Only called when a drag ends: writing on every pointermove would hit localStorage dozens of
  // times a second for a value nothing reads until the next mount.
  const persist = useCallback(() => {
    setWidth((current) => {
      localStorage.setItem(WIDTH_STORAGE_KEY, String(Math.round(current)));
      return current;
    });
  }, []);
  return [width, setWidth, persist];
}

interface GraphSidePanelProps {
  width: number;
  onResize: (width: number) => void;
  onResizeEnd: () => void;
  zIndex: number;
  // When set, the panel draws its own close button. Panels whose content already has one (the
  // timer manager) leave it off.
  onClose?: () => void;
  children: ReactNode;
}

// The floating panel docked to the right of the node canvas, with a drag handle on its inner
// edge. Content scrolls inside it, so the handle and close button stay put however long the
// content is.
export default function GraphSidePanel(props: GraphSidePanelProps) {
  const { width, onResize, onResizeEnd, zIndex, onClose, children } = props;
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; width: number } | null>(null);

  function onHandlePointerDown(e: React.PointerEvent) {
    if (e.button !== 0) {
      return;
    }
    // Without this the drag sweeps a text selection across the panel's content.
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, width };
  }

  function onHandlePointerMove(e: React.PointerEvent) {
    const start = dragStart.current;
    if (!start) {
      return;
    }
    // The panel is pinned to the right edge, so dragging left (a negative delta) widens it.
    const next = start.width + (start.x - e.clientX);
    // offsetParent is the graph container the panel is absolutely positioned in - the ceiling
    // follows the window instead of being a guessed constant.
    const available = (panelRef.current?.offsetParent as HTMLElement | null)?.clientWidth ?? next;
    onResize(Math.max(MIN_WIDTH, Math.min(next, available - MIN_CANVAS_WIDTH)));
  }

  function onHandlePointerUp(e: React.PointerEvent) {
    if (!dragStart.current) {
      return;
    }
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    dragStart.current = null;
    onResizeEnd();
  }

  return (
    <div
      ref={panelRef}
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        bottom: 8,
        width,
        // Safety net for a stored width wider than the window the graph is opened in next.
        maxWidth: 'calc(100% - 16px)',
        zIndex,
        display: 'flex',
        background: 'var(--color-background-near, #242424)',
        border: '1px solid var(--color-border, #444)',
        borderRadius: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className='graph-side-panel-resizer'
        title='Drag to resize'
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onPointerCancel={onHandlePointerUp}
      />
      {onClose ? (
        <div
          onClick={onClose}
          title='Close'
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 22,
            height: 22,
            lineHeight: '20px',
            textAlign: 'center',
            borderRadius: 4,
            border: '1px solid var(--color-border, #444)',
            cursor: 'pointer',
            userSelect: 'none',
            fontSize: '0.9rem',
            zIndex: 1,
          }}
        >
          ×
        </div>
      ) : null}
      <div style={{ flex: '1 1 auto', minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
