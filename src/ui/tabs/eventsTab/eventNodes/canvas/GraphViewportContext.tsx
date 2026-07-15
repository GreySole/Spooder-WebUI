import React, { createContext, useContext } from 'react';
import { Transform } from './types';

export interface GraphViewportContextValue {
  transform: Transform;
  viewportRef: React.RefObject<HTMLDivElement>;
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
