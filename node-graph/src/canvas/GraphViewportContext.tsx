import React, { createContext, useContext } from 'react';
import { Transform } from './types';

export interface GraphViewportContextValue {
  transform: Transform;
  viewportRef: React.RefObject<HTMLDivElement>;
  // True while two fingers are on the canvas. The viewport owns that gesture, so anything the
  // first finger started elsewhere (a node drag, a wire) drops it while this is set.
  isPinching: boolean;
  // Set right before a right-drag marquee's release, so the native `contextmenu` event that
  // follows (fired by the browser after any right-button mouseup) opens nothing instead of
  // popping the node menu on top of whatever the drag just selected. One-shot: whoever reads it
  // (NodeGraphCanvas's contextmenu listener) clears it back to false.
  suppressContextMenuRef: React.MutableRefObject<boolean>;
}

const GraphViewportContext = createContext<GraphViewportContextValue | null>(null);

export const GraphViewportProvider = GraphViewportContext.Provider;

export function useGraphViewport(): GraphViewportContextValue {
  const ctx = useContext(GraphViewportContext);
  if (!ctx) {
    throw new Error('useGraphViewport must be used within a GraphViewport');
  }
  return ctx;
}
