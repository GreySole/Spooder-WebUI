import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EventGraphEdge, EventGraphNode } from '../../../../Types';
import GraphNodeCard from '../GraphNodeCard';
import { BESPOKE_EDITOR_CORE_NODES } from '../coreNodeDefs';
import { getCustomFieldHeight } from '../fieldRenderers';
import { ResolvedNodeDef } from '../nodeDefLookup';
import EdgeLayer from './EdgeLayer';
import GraphViewport from './GraphViewport';
import { useGraphViewport } from './GraphViewportContext';
import { computeNodePortLayout, nodeCardHeight, NodePortLayout, resolveNodeWidth } from './nodeLayout';
import { computeFitTransform, screenToGraph } from './transform';
import { ContextMenuAnchor, PendingConnection, Point, Transform } from './types';
import { BoxSelectRect, rectIntersectsNode } from './useBoxSelect';
import { useConnectionDraft } from './useConnectionDraft';
import { useNodeDrag } from './useNodeDrag';
import { useNodeResize } from './useNodeResize';

// How far the pointer must travel before grabbing a connected input socket counts as pulling
// the wire off rather than clicking the socket. Matches useNodeDrag's own click tolerance.
const DETACH_THRESHOLD = 2;

export interface NodeGraphCanvasProps {
  // Identifies the graph's slot in the form, so node cards can bind their inline controls to
  // the same form keys the inspector pane uses.
  eventName: string;
  nodes: EventGraphNode[];
  edges: EventGraphEdge[];
  resolveDef: (node: EventGraphNode) => ResolvedNodeDef | undefined;
  selectedNodeIds: string[];
  onSelectNodes: (nodeIds: string[]) => void;
  // Every node that moved in one drag, so a multi-node move is a single form update.
  onNodesDragEnd: (positions: Map<string, Point>) => void;
  // A card the user dragged wider or narrower. `onNodeResetWidth` clears that override again, so
  // the card goes back to whatever width its node type asks for.
  onNodeResizeEnd: (nodeId: string, width: number) => void;
  onNodeResetWidth: (nodeId: string) => void;
  onNodesDelete: (nodeIds: string[]) => void;
  onEdgeDelete: (edgeId: string) => void;
  onConnect: (connection: PendingConnection) => void;
  isValidConnection: (connection: PendingConnection) => boolean;
  // Right click / shift+space over the graph: the caller renders the node menu at the anchor
  // and drops whatever is chosen at its graph point.
  onOpenContextMenu: (anchor: ContextMenuAnchor) => void;
}

// react-hook-form mutates its values object in place, so editing a field leaves `nodes` with
// the same array/object identity even though its contents changed. Reference-equal memo deps
// would stay stale until something replaced the array wholesale (e.g. a node drag calling
// setValue), so layout work is keyed on this structural signature instead - that's what makes
// arg outputs appear and recolor as soon as argCount/argTypes change.
function graphSignature(nodes: EventGraphNode[], edges: EventGraphEdge[]): string {
  return JSON.stringify([
    nodes.map((n) => [n.id, n.kind, n.moduleName, n.nodeTypeId, n.values, n.width]),
    edges.map((e) => [e.toNode, e.toPort]),
  ]);
}

// Resolved card widths, keyed by node id. Read by the cards (what they draw at), EdgeLayer
// (where an output socket sits) and box selection - all three have to agree, so it is computed
// once here rather than three times from the same inputs.
function useNodeWidths(
  nodes: EventGraphNode[],
  edges: EventGraphEdge[],
  resolveDef: (node: EventGraphNode) => ResolvedNodeDef | undefined,
): Map<string, number> {
  const signature = graphSignature(nodes, edges);
  return useMemo(
    () => new Map(nodes.map((n) => [n.id, resolveNodeWidth(n.width, resolveDef(n)?.nodeWidth)])),
    [signature, nodes, resolveDef],
  );
}

// One layout per node, shared by the cards (socket dots + field rows), EdgeLayer (edge
// endpoints) and box selection (card heights). They must all read the same geometry, or edges
// detach from their sockets and the marquee catches the wrong nodes.
function useNodeLayouts(
  nodes: EventGraphNode[],
  edges: EventGraphEdge[],
  resolveDef: (node: EventGraphNode) => ResolvedNodeDef | undefined,
): Map<string, NodePortLayout> {
  const signature = graphSignature(nodes, edges);
  return useMemo(() => {
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
          moduleName: n.moduleName,
          customFieldHeight: getCustomFieldHeight,
          connectedInputPorts: connectedByNode.get(n.id),
          inlineControlsDisabled:
            n.moduleName === 'core' && BESPOKE_EDITOR_CORE_NODES.includes(n.nodeTypeId),
        }),
      ),
    );
    return map;
  }, [signature, nodes, edges, resolveDef]);
}

export default function NodeGraphCanvas(props: NodeGraphCanvasProps) {
  const { nodes, edges, resolveDef, selectedNodeIds, onSelectNodes } = props;
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [selectedEdgeId, setSelectedEdgeId] = useState('');

  // Computed out here rather than in the inner canvas because the box-select hit test needs
  // node sizes, and that gesture belongs to the viewport (which wraps the inner canvas). These
  // are the stored widths; the inner canvas overlays the one currently being dragged.
  const nodeLayouts = useNodeLayouts(nodes, edges, resolveDef);
  const nodeWidths = useNodeWidths(nodes, edges, resolveDef);

  function handleBoxSelect(rect: BoxSelectRect, additive: boolean) {
    const hits = nodes
      .filter((node) => {
        const layout = nodeLayouts.get(node.id);
        return (
          layout &&
          rectIntersectsNode(rect, node.position, {
            width: nodeWidths.get(node.id)!,
            height: nodeCardHeight(layout),
          })
        );
      })
      .map((node) => node.id);
    // Holding the modifier adds to what's already picked, so several boxes can build one
    // selection; without it the box replaces the selection outright, empty box included.
    onSelectNodes(additive ? [...new Set([...selectedNodeIds, ...hits])] : hits);
    if (hits.length > 0) {
      setSelectedEdgeId('');
    }
  }

  return (
    <GraphViewport
      transform={transform}
      onTransformChange={setTransform}
      onBackgroundClick={() => {
        onSelectNodes([]);
        setSelectedEdgeId('');
      }}
      onBoxSelect={handleBoxSelect}
    >
      <NodeGraphCanvasInner
        {...props}
        nodeLayouts={nodeLayouts}
        nodeWidths={nodeWidths}
        transform={transform}
        setTransform={setTransform}
        selectedEdgeId={selectedEdgeId}
        setSelectedEdgeId={setSelectedEdgeId}
      />
    </GraphViewport>
  );
}

interface InnerProps extends NodeGraphCanvasProps {
  nodeLayouts: Map<string, NodePortLayout>;
  nodeWidths: Map<string, number>;
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
    selectedNodeIds,
    onSelectNodes,
    onNodesDragEnd,
    onNodesDelete,
    onEdgeDelete,
    onNodeResizeEnd,
    onNodeResetWidth,
    nodeLayouts,
    nodeWidths,
    onConnect,
    isValidConnection,
    onOpenContextMenu,
    transform,
    setTransform,
    selectedEdgeId,
    setSelectedEdgeId,
  } = props;

  const { viewportRef, isPinching } = useGraphViewport();
  const contentRef = useRef<HTMLDivElement>(null);
  const fitDone = useRef(false);
  // The wire currently being pulled off an input socket: held in a ref for the pointerup
  // bookkeeping, mirrored into state so EdgeLayer can stop drawing it while it's in hand.
  const detach = useRef<{ edgeId: string; screen: Point } | null>(null);
  const [detachedEdgeId, setDetachedEdgeId] = useState('');

  const nodeDrag = useNodeDrag(transform.scale, onNodesDragEnd);
  const nodeResize = useNodeResize(transform.scale, onNodeResizeEnd);

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

  // See useNodeLayouts for why the memo below is keyed on a structural signature rather than
  // on the arrays themselves.
  const layoutSignature = graphSignature(nodes, edges);

  // Every edge indexed by the input socket it lands on, so grabbing a socket can find the wire
  // to unhook. Exec inputs accept several incoming edges (many nodes can run into one action),
  // so the value is a list and a grab takes the most recently connected one.
  const edgesByTargetPort = useMemo(() => {
    const byPort = new Map<string, EventGraphEdge[]>();
    const portsByNode = new Map<string, Set<string>>();
    edges.forEach((e) => {
      const key = `${e.toNode}:${e.toPort}`;
      if (!byPort.has(key)) {
        byPort.set(key, []);
      }
      byPort.get(key)!.push(e);
      if (!portsByNode.has(e.toNode)) {
        portsByNode.set(e.toNode, new Set());
      }
      portsByNode.get(e.toNode)!.add(e.toPort);
    });
    return { byPort, portsByNode };
  }, [layoutSignature, edges]);

  // A trigger whose exec output goes nowhere can never run anything - the commonest way to end
  // up with a graph that silently does nothing, so the card says so.
  const unlinkedTriggers = useMemo(() => {
    const wired = new Set(edges.filter((e) => e.fromPort === 'exec').map((e) => e.fromNode));
    return new Set(
      nodes.filter((n) => n.kind === 'callback' && !wired.has(n.id)).map((n) => n.id),
    );
  }, [layoutSignature, nodes, edges]);

  const nodePositions = useMemo(() => {
    const map = new Map<string, Point>();
    const dragging = nodeDrag.dragState?.positions;
    nodes.forEach((n) => {
      map.set(n.id, dragging?.get(n.id) ?? n.position);
    });
    return map;
  }, [nodes, nodeDrag.dragState]);

  // The card currently being resized draws at the live width rather than its stored one, so the
  // card and the edges leaving it follow the pointer together.
  const liveNodeWidths = useMemo(() => {
    const resizing = nodeResize.resizeState;
    if (!resizing) {
      return nodeWidths;
    }
    return new Map(nodeWidths).set(resizing.nodeId, resizing.width);
  }, [nodeWidths, nodeResize.resizeState]);

  // Two fingers on the canvas is a pinch, and the viewport owns it. Whatever the first finger
  // started here is abandoned rather than committed: it was a finger resting on a card, not an
  // attempt to move it.
  useLayoutEffect(() => {
    if (!isPinching) {
      return;
    }
    nodeDrag.cancel();
    nodeResize.cancel();
    connectionDraft.cancel();
    detach.current = null;
    setDetachedEdgeId('');
  }, [isPinching, nodeDrag, nodeResize, connectionDraft]);

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

  // Both openers place the menu where the cursor is, so shift+space needs the pointer position
  // even though a key event carries none. Kept in a ref: it changes on every mouse move and
  // nothing renders from it.
  const lastPointer = useRef<Point | null>(null);
  useLayoutEffect(() => {
    function onPointerMove(e: PointerEvent) {
      lastPointer.current = { x: e.clientX, y: e.clientY };
    }
    document.addEventListener('pointermove', onPointerMove);
    return () => document.removeEventListener('pointermove', onPointerMove);
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    // `target` decides whether the menu also offers actions on a node: the card wrappers carry
    // a data-node-id, so a right click anywhere on a card (or on the socket dots it owns) finds
    // it, and a click on empty canvas finds nothing.
    function openAt(clientX: number, clientY: number, target: Element | null) {
      const rect = viewport!.getBoundingClientRect();
      const screen = { x: clientX - rect.left, y: clientY - rect.top };
      onOpenContextMenu({
        screen,
        graph: screenToGraph(transform, screen),
        viewport: { width: rect.width, height: rect.height },
        nodeId: (target?.closest('[data-node-id]') as HTMLElement | null)?.dataset.nodeId,
      });
    }

    function onContextMenu(e: MouseEvent) {
      // The browser menu has nothing useful for a node canvas, and this one replaces it.
      e.preventDefault();
      openAt(e.clientX, e.clientY, e.target as Element | null);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== 'Space' || !e.shiftKey) {
        return;
      }
      const active = document.activeElement as HTMLElement | null;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return;
      }
      // Gated on the pointer being over the graph rather than on focus: the shortcut opens the
      // menu *at the cursor*, so a cursor that isn't on the canvas has nowhere to open it, and
      // shift+space stays free for the rest of the page.
      const pointer = lastPointer.current;
      const rect = viewport!.getBoundingClientRect();
      if (
        !pointer ||
        pointer.x < rect.left ||
        pointer.x > rect.right ||
        pointer.y < rect.top ||
        pointer.y > rect.bottom
      ) {
        return;
      }
      e.preventDefault();
      openAt(pointer.x, pointer.y, document.elementFromPoint(pointer.x, pointer.y));
    }

    viewport.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      viewport.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [transform, onOpenContextMenu, viewportRef]);

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
      } else if (selectedNodeIds.length > 0) {
        onNodesDelete(selectedNodeIds);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedEdgeId, selectedNodeIds, onEdgeDelete, onNodesDelete]);

  function handlePointerMove(e: React.PointerEvent) {
    nodeDrag.onPointerMove(e);
    nodeResize.onPointerMove(e);
    connectionDraft.onPointerMove(e);
  }

  function handlePointerUp(e: React.PointerEvent) {
    nodeDrag.onPointerUp(e);
    nodeResize.onPointerUp(e);
    const detached = detach.current;
    if (detached) {
      detach.current = null;
      setDetachedEdgeId('');
      const travelled = Math.hypot(e.clientX - detached.screen.x, e.clientY - detached.screen.y);
      if (travelled <= DETACH_THRESHOLD) {
        // Just a click on the socket - put the wire back exactly as it was.
        connectionDraft.cancel(e);
        return;
      }
      // Committed before the draft resolves its drop target, so that reconnecting to a data
      // input sees a graph the old edge has already left (onConnect replaces whatever occupies
      // the target port).
      onEdgeDelete(detached.edgeId);
    }
    connectionDraft.onPointerUp(e);
  }

  // A cancelled pointer (browser gesture takeover, touch interruption) is not a drop: the wire
  // in hand goes back where it was rather than being deleted or reconnected.
  function handlePointerCancel(e: React.PointerEvent) {
    nodeDrag.onPointerUp(e);
    nodeResize.onPointerUp(e);
    detach.current = null;
    setDetachedEdgeId('');
    connectionDraft.cancel(e);
  }

  // Unhooking a wire: the user grabs a connected input socket and drags the loose end away.
  // The edge is only hidden here, not deleted - the deletion is committed on pointerup, and
  // only if the pointer actually travelled, so a stray click on a socket can't silently drop a
  // connection. Dropping the loose end on another socket reconnects it; dropping it on empty
  // space leaves the edge deleted.
  function handleDetachConnection(e: React.PointerEvent, nodeId: string, portId: string): boolean {
    const candidates = edgesByTargetPort.byPort.get(`${nodeId}:${portId}`);
    if (e.button !== 0 || !candidates?.length) {
      return false;
    }
    // Exec inputs take several incoming edges; the most recently connected one is the one that
    // comes off, which is also the one drawn on top.
    const edge = candidates[candidates.length - 1];
    const sourcePort = nodeLayouts.get(edge.fromNode)?.outputs.find((p) => p.portId === edge.fromPort);
    detach.current = { edgeId: edge.id, screen: { x: e.clientX, y: e.clientY } };
    setDetachedEdgeId(edge.id);
    if (selectedEdgeId === edge.id) {
      setSelectedEdgeId('');
    }
    connectionDraft.start(e, edge.fromNode, edge.fromPort, sourcePort?.dataType, contentRef.current);
    return true;
  }

  function handleSelectNode(nodeId: string, additive: boolean) {
    setSelectedEdgeId('');
    if (additive) {
      onSelectNodes(
        selectedNodeIds.includes(nodeId)
          ? selectedNodeIds.filter((id) => id !== nodeId)
          : [...selectedNodeIds, nodeId],
      );
      return;
    }
    // Pressing a node that's already part of a multi-selection keeps that selection, so the
    // drag it's about to start moves the whole group. Pressing an unselected one replaces it.
    if (!selectedNodeIds.includes(nodeId)) {
      onSelectNodes([nodeId]);
    }
  }

  function handleSelectEdge(edgeId: string) {
    onSelectNodes([]);
    setSelectedEdgeId(edgeId);
  }

  // A drag started on a selected node moves everything selected; on an unselected node (which
  // the pointerdown just made the selection) it moves only that one.
  function draggedNodesFor(nodeId: string) {
    const ids = selectedNodeIds.includes(nodeId) ? selectedNodeIds : [nodeId];
    return nodes.filter((n) => ids.includes(n.id)).map((n) => ({ id: n.id, position: n.position }));
  }

  return (
    <div
      ref={contentRef}
      data-canvas-background='true'
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{ position: 'relative' }}
    >
      <EdgeLayer
        edges={edges}
        hiddenEdgeId={detachedEdgeId}
        nodePositions={nodePositions}
        nodeWidths={liveNodeWidths}
        nodeLayouts={nodeLayouts}
        selectedEdgeId={selectedEdgeId}
        onSelectEdge={handleSelectEdge}
        draft={connectionDraft.draft}
      />
      {nodes.map((node, nodeIndex) => {
        const position = nodePositions.get(node.id)!;
        return (
          <div
            key={node.id}
            data-node-id={node.id}
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              // Cards paint in graph order, so a node dragged across the canvas would otherwise
              // slide underneath its neighbours mid-move.
              zIndex: nodeDrag.dragState?.positions.has(node.id) ? 5 : undefined,
            }}
          >
            <GraphNodeCard
              id={node.id}
              kind={node.kind}
              moduleName={node.moduleName}
              nodeTypeId={node.nodeTypeId}
              def={resolveDef(node)}
              selected={selectedNodeIds.includes(node.id)}
              layout={nodeLayouts.get(node.id)!}
              width={liveNodeWidths.get(node.id)!}
              eventName={eventName}
              nodeIndex={nodeIndex}
              values={node.values}
              unlinked={unlinkedTriggers.has(node.id)}
              connectedInputPorts={edgesByTargetPort.portsByNode.get(node.id)}
              onSelect={handleSelectNode}
              onNodePointerDown={(e, nodeId) =>
                nodeDrag.startDrag(e, draggedNodesFor(nodeId), contentRef.current)
              }
              onStartConnection={(e, nodeId, portId, dataType) =>
                connectionDraft.start(e, nodeId, portId, dataType, contentRef.current)
              }
              onDetachConnection={handleDetachConnection}
              onStartResize={nodeResize.startResize}
              onResetWidth={onNodeResetWidth}
            />
          </div>
        );
      })}
    </div>
  );
}
