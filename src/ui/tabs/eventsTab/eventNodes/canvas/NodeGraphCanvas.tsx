import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EventGraphEdge, EventGraphNode } from '../../../../Types';
import GraphNodeCard from '../GraphNodeCard';
import { BESPOKE_EDITOR_CORE_NODES } from '../coreNodeDefs';
import { ResolvedNodeDef } from '../nodeDefLookup';
import EdgeLayer from './EdgeLayer';
import GraphViewport from './GraphViewport';
import { useGraphViewport } from './GraphViewportContext';
import { computeNodePortLayout, NodePortLayout } from './nodeLayout';
import { computeFitTransform } from './transform';
import { PendingConnection, Point, Transform } from './types';
import { useConnectionDraft } from './useConnectionDraft';
import { useNodeDrag } from './useNodeDrag';

export interface NodeGraphCanvasProps {
  // Identifies the graph's slot in the form, so node cards can bind their inline controls to
  // the same form keys the inspector pane uses.
  eventName: string;
  nodes: EventGraphNode[];
  edges: EventGraphEdge[];
  resolveDef: (node: EventGraphNode) => ResolvedNodeDef | undefined;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onNodeDragEnd: (nodeId: string, position: Point) => void;
  onNodeDelete: (nodeId: string) => void;
  onEdgeDelete: (edgeId: string) => void;
  onConnect: (connection: PendingConnection) => void;
  isValidConnection: (connection: PendingConnection) => boolean;
}

export default function NodeGraphCanvas(props: NodeGraphCanvasProps) {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [selectedEdgeId, setSelectedEdgeId] = useState('');

  return (
    <GraphViewport
      transform={transform}
      onTransformChange={setTransform}
      onBackgroundClick={() => {
        props.onSelectNode('');
        setSelectedEdgeId('');
      }}
    >
      <NodeGraphCanvasInner
        {...props}
        transform={transform}
        setTransform={setTransform}
        selectedEdgeId={selectedEdgeId}
        setSelectedEdgeId={setSelectedEdgeId}
      />
    </GraphViewport>
  );
}

interface InnerProps extends NodeGraphCanvasProps {
  transform: Transform;
  setTransform: (t: Transform) => void;
  selectedEdgeId: string;
  setSelectedEdgeId: (id: string) => void;
}

function NodeGraphCanvasInner(props: InnerProps) {
  const {
    eventName,
    nodes,
    edges,
    resolveDef,
    selectedNodeId,
    onSelectNode,
    onNodeDragEnd,
    onNodeDelete,
    onEdgeDelete,
    onConnect,
    isValidConnection,
    transform,
    setTransform,
    selectedEdgeId,
    setSelectedEdgeId,
  } = props;

  const { viewportRef } = useGraphViewport();
  const contentRef = useRef<HTMLDivElement>(null);
  const fitDone = useRef(false);

  const nodeDrag = useNodeDrag(transform.scale, (nodeId, position) => {
    onNodeDragEnd(nodeId, position);
  });

  const connectionDraft = useConnectionDraft(transform, viewportRef, (from, to) => {
    const connection: PendingConnection = {
      source: from.nodeId,
      sourceHandle: from.portId,
      target: to.nodeId,
      targetHandle: to.portId,
    };
    if (isValidConnection(connection)) {
      onConnect(connection);
    }
  });

  // react-hook-form mutates its values object in place, so editing a field leaves `nodes` with
  // the same array/object identity even though its contents changed. Reference-equal deps
  // would keep the memo below stale until something replaced the array wholesale (e.g. a node
  // drag calling setValue), so the layout is keyed on a structural signature instead - that's
  // what makes arg outputs appear and recolor as soon as argCount/argTypes change.
  const layoutSignature = JSON.stringify([
    nodes.map((n) => [n.id, n.kind, n.moduleName, n.nodeTypeId, n.values]),
    edges.map((e) => [e.toNode, e.toPort]),
  ]);

  // One layout per node, shared by the cards (socket dots + field rows) and EdgeLayer (edge
  // endpoints). Both must read the same geometry or edges will detach from their sockets.
  const nodeLayouts = useMemo(() => {
    const connectedByNode = new Map<string, Set<string>>();
    edges.forEach((e) => {
      if (e.toPort === 'exec') {
        return;
      }
      if (!connectedByNode.has(e.toNode)) {
        connectedByNode.set(e.toNode, new Set());
      }
      connectedByNode.get(e.toNode)!.add(e.toPort);
    });

    const map = new Map<string, NodePortLayout>();
    nodes.forEach((n) =>
      map.set(
        n.id,
        computeNodePortLayout(n.kind, resolveDef(n), {
          values: n.values,
          connectedInputPorts: connectedByNode.get(n.id),
          inlineControlsDisabled:
            n.moduleName === 'core' && BESPOKE_EDITOR_CORE_NODES.includes(n.nodeTypeId),
        }),
      ),
    );
    return map;
  }, [layoutSignature, nodes, edges, resolveDef]);

  const nodePositions = useMemo(() => {
    const map = new Map<string, Point>();
    const drag = nodeDrag.dragState;
    nodes.forEach((n) => {
      map.set(n.id, drag && drag.nodeId === n.id ? drag.position : n.position);
    });
    return map;
  }, [nodes, nodeDrag.dragState]);

  // One-shot fit-to-view: only runs until it succeeds once, so it never fights the user's
  // subsequent manual pan/zoom (mirrors the intent of ReactFlow's mount-time fitView).
  useLayoutEffect(() => {
    if (fitDone.current || nodes.length === 0) {
      return;
    }
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
      return;
    }
    setTransform(computeFitTransform(nodes, { width: rect.width, height: rect.height }));
    fitDone.current = true;
  });

  useLayoutEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Delete' && e.key !== 'Backspace') {
        return;
      }
      const active = document.activeElement as HTMLElement | null;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return;
      }
      if (selectedEdgeId) {
        onEdgeDelete(selectedEdgeId);
        setSelectedEdgeId('');
      } else if (selectedNodeId) {
        onNodeDelete(selectedNodeId);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedEdgeId, selectedNodeId, onEdgeDelete, onNodeDelete]);

  function handlePointerMove(e: React.PointerEvent) {
    nodeDrag.onPointerMove(e);
    connectionDraft.onPointerMove(e);
  }

  function handlePointerUp(e: React.PointerEvent) {
    nodeDrag.onPointerUp(e);
    connectionDraft.onPointerUp(e);
  }

  function handleSelectNode(nodeId: string) {
    setSelectedEdgeId('');
    onSelectNode(nodeId);
  }

  function handleSelectEdge(edgeId: string) {
    onSelectNode('');
    setSelectedEdgeId(edgeId);
  }

  return (
    <div
      ref={contentRef}
      data-canvas-background='true'
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ position: 'relative' }}
    >
      <EdgeLayer
        edges={edges}
        nodePositions={nodePositions}
        nodeLayouts={nodeLayouts}
        selectedEdgeId={selectedEdgeId}
        onSelectEdge={handleSelectEdge}
        draft={connectionDraft.draft}
      />
      {nodes.map((node, nodeIndex) => {
        const position = nodePositions.get(node.id)!;
        return (
          <div key={node.id} style={{ position: 'absolute', left: position.x, top: position.y }}>
            <GraphNodeCard
              id={node.id}
              kind={node.kind}
              moduleName={node.moduleName}
              nodeTypeId={node.nodeTypeId}
              def={resolveDef(node)}
              selected={node.id === selectedNodeId}
              layout={nodeLayouts.get(node.id)!}
              eventName={eventName}
              nodeIndex={nodeIndex}
              oscAddress={node.values?.address}
              onSelect={handleSelectNode}
              onHeaderPointerDown={(e, nodeId) => nodeDrag.startDrag(e, nodeId, node.position, contentRef.current)}
              onStartConnection={(e, nodeId, portId, dataType) =>
                connectionDraft.start(e, nodeId, portId, dataType, contentRef.current)
              }
            />
          </div>
        );
      })}
    </div>
  );
}
