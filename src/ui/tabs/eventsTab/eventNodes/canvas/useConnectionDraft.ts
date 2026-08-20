import { useCallback, useRef, useState } from 'react';
import { NodePortDataType } from '../../../../Types';
import { screenToGraph } from './transform';
import { Point, Transform } from './types';

export interface ConnectionEndpoint {
  nodeId: string;
  portId: string;
}

export interface ConnectionDraftState {
  fromNodeId: string;
  fromPortId: string;
  dataType?: NodePortDataType;
  cursor: Point; // graph-space
}

// Manages an in-progress "drag a wire from an output socket" interaction. Completion is
// resolved via document.elementFromPoint + closest('[data-socket-id]') rather than manual
// geometric hit-testing - sockets are real, correctly z-ordered/clipped DOM elements, so this
// stays correct under pan/zoom for free.
export function useConnectionDraft(
  transform: Transform,
  viewportRef: React.RefObject<HTMLDivElement>,
  onComplete: (from: ConnectionEndpoint, to: ConnectionEndpoint) => void,
) {
  const [draft, setDraft] = useState<ConnectionDraftState | null>(null);
  // Includes the pointer that started the wire, so another finger's moves don't drag it.
  const origin = useRef<{
    nodeId: string;
    portId: string;
    dataType?: NodePortDataType;
    pointerId: number;
  } | null>(null);

  const toGraphPoint = useCallback(
    (e: { clientX: number; clientY: number }): Point => {
      const rect = viewportRef.current?.getBoundingClientRect();
      const screen = { x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) };
      return screenToGraph(transform, screen);
    },
    [transform, viewportRef],
  );

  const start = useCallback(
    (
      e: React.PointerEvent,
      nodeId: string,
      portId: string,
      dataType: NodePortDataType | undefined,
      captureTarget: Element | null,
    ) => {
      // Left button only, for the same reason as useNodeDrag.startDrag.
      if (e.button !== 0) {
        return;
      }
      // Same reason as useNodeDrag.startDrag: without this, dragging a wire out of a socket
      // starts a native text selection that sweeps across the cards it passes over.
      e.preventDefault();
      captureTarget?.setPointerCapture(e.pointerId);
      origin.current = { nodeId, portId, dataType, pointerId: e.pointerId };
      setDraft({ fromNodeId: nodeId, fromPortId: portId, dataType, cursor: toGraphPoint(e) });
    },
    [toGraphPoint],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!origin.current || e.pointerId !== origin.current.pointerId) {
        return;
      }
      const cursor = toGraphPoint(e);
      setDraft((current) => (current ? { ...current, cursor } : current));
    },
    [toGraphPoint],
  );

  // Abandons an in-progress draft without resolving a drop target. Used when a grab on a
  // connected input socket turns out to have been a plain click, so nothing should change.
  // The event is optional: a click that turned out not to be a drag has one to release capture
  // with, a pinch taking the gesture over does not.
  const cancel = useCallback((e?: React.PointerEvent) => {
    if (!origin.current) {
      return;
    }
    if (e) {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    }
    origin.current = null;
    setDraft(null);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!origin.current || e.pointerId !== origin.current.pointerId) {
        return;
      }
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      const from = origin.current;
      origin.current = null;
      setDraft(null);

      const dropEl = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const socketEl = dropEl?.closest('[data-socket-id]') as HTMLElement | null;
      const socketId = socketEl?.dataset.socketId;
      // Only input sockets are valid drop targets: a wire released over another *output* would
      // otherwise be turned into an edge whose toPort names a port that has no input socket at
      // all, leaving an edge nothing can draw or resolve.
      if (!socketId || socketEl?.dataset.socketSide !== 'in') {
        return;
      }
      const sep = socketId.indexOf(':');
      const toNodeId = socketId.slice(0, sep);
      const toPortId = socketId.slice(sep + 1);
      onComplete({ nodeId: from.nodeId, portId: from.portId }, { nodeId: toNodeId, portId: toPortId });
    },
    [onComplete],
  );

  return { draft, start, cancel, onPointerMove, onPointerUp };
}
