import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useEvents from '../../../app/hooks/useEvents';
import { EventGraph, EventGraphEdge, EventGraphNode } from '../../Types';
import { buildGraphKey } from './FormKeys';
import NodeGraphCanvas from './eventNodes/canvas/NodeGraphCanvas';
import { ContextMenuAnchor, PendingConnection, Point } from './eventNodes/canvas/types';
import NodeInspector from './eventNodes/NodeInspector';
import NodePalette from './eventNodes/NodePalette';
import NodeContextMenu from './eventNodes/palette/NodeContextMenu';
import useNodePalette from './eventNodes/palette/useNodePalette';
import { OscLiveValuesProvider } from './eventNodes/OscLiveValues';
import TimerManagerPanel from './eventNodes/TimerManagerPanel';
import { resolveNodeDef } from './eventNodes/nodeDefLookup';
import useInspectorHasContent from './eventNodes/useInspectorHasContent';

interface EventNodesProps {
  eventName: string;
}

export default function EventNodes(props: EventNodesProps) {
  const { eventName } = props;
  const { watch, setValue, getValues } = useFormContext();
  const { getNodeManifest, getOperationNodes } = useEvents();
  const { manifests } = getNodeManifest();
  const { operationNodes } = getOperationNodes();

  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [timerManagerOpen, setTimerManagerOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuAnchor | null>(null);

  // One palette tree, rendered by both the corner buttons and the canvas context menu.
  const palette = useNodePalette({ eventName, onManageTimers: () => setTimerManagerOpen(true) });
  // Most nodes are edited entirely on their card, so their panel would open with nothing in it.
  const inspectorHasContent = useInspectorHasContent(eventName, selectedNodeId);

  const graphKey = buildGraphKey(eventName);
  const graph: EventGraph = watch(graphKey);

  const resolveDef = useCallback(
    (node: Pick<EventGraphNode, 'kind' | 'moduleName' | 'nodeTypeId' | 'values'>) =>
      resolveNodeDef(node, manifests, operationNodes),
    [manifests, operationNodes],
  );

  const handleNodeDragEnd = useCallback(
    (nodeId: string, position: Point) => {
      const currentGraph: EventGraph = getValues(graphKey);
      const nextNodes = currentGraph.nodes.map((n) => (n.id === nodeId ? { ...n, position } : n));
      setValue(`${graphKey}.nodes`, nextNodes, { shouldDirty: true });
    },
    [getValues, graphKey, setValue],
  );

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      const currentGraph: EventGraph = getValues(graphKey);
      const remainingNodes = currentGraph.nodes.filter((n) => n.id !== nodeId);
      const remainingEdges = currentGraph.edges.filter((e) => e.fromNode !== nodeId && e.toNode !== nodeId);
      setValue(`${graphKey}.nodes`, remainingNodes, { shouldDirty: true });
      setValue(`${graphKey}.edges`, remainingEdges, { shouldDirty: true });
      setSelectedNodeId((current) => (current === nodeId ? '' : current));
    },
    [getValues, graphKey, setValue],
  );

  const handleNodeDuplicate = useCallback(
    (nodeId: string) => {
      const currentGraph: EventGraph = getValues(graphKey);
      const source = currentGraph.nodes.find((n) => n.id === nodeId);
      if (!source) {
        return;
      }
      const copy: EventGraphNode = {
        ...source,
        id: uuidv4(),
        // Deep copy so the two nodes don't share nested value objects (an OSC trigger's arg
        // labels, a condition group) - react-hook-form edits those in place, which would
        // otherwise edit both nodes at once.
        values: JSON.parse(JSON.stringify(source.values ?? {})),
        // Offset rather than dropped at the cursor: the copy lands beside the original instead
        // of directly on top of it, wherever the right click happened to be on the card.
        position: { x: source.position.x + 30, y: source.position.y + 30 },
      };
      setValue(`${graphKey}.nodes`, [...currentGraph.nodes, copy], { shouldDirty: true });
      // Wires aren't copied, so the new node is selected as the thing to hook up next.
      setSelectedNodeId(copy.id);
    },
    [getValues, graphKey, setValue],
  );

  const handleEdgeDelete = useCallback(
    (edgeId: string) => {
      const currentGraph: EventGraph = getValues(graphKey);
      const nextEdges = currentGraph.edges.filter((e) => e.id !== edgeId);
      setValue(`${graphKey}.edges`, nextEdges, { shouldDirty: true });
    },
    [getValues, graphKey, setValue],
  );

  const onConnect = useCallback(
    (connection: PendingConnection) => {
      const newEdge: EventGraphEdge = {
        id: uuidv4(),
        fromNode: connection.source,
        fromPort: connection.sourceHandle,
        toNode: connection.target,
        toPort: connection.targetHandle,
      };
      const currentGraph: EventGraph = getValues(graphKey);
      // A data input takes exactly one wire - the executor resolves it as
      // `resolved[toPort] = <source value>`, so a second edge into the same port would silently
      // shadow the first. Re-hooking a wire onto an occupied input therefore replaces what was
      // there. Exec inputs keep their fan-in (several nodes may run into one action); only an
      // exact duplicate of an existing edge is dropped there.
      const replaced = currentGraph.edges.filter((e) =>
        newEdge.toPort === 'exec'
          ? !(e.fromNode === newEdge.fromNode && e.fromPort === newEdge.fromPort && e.toNode === newEdge.toNode && e.toPort === 'exec')
          : !(e.toNode === newEdge.toNode && e.toPort === newEdge.toPort),
      );
      setValue(`${graphKey}.edges`, [...replaced, newEdge], { shouldDirty: true });
    },
    [getValues, graphKey, setValue],
  );

  const isValidConnection = useCallback(
    (connection: PendingConnection) => {
      const currentGraph: EventGraph = getValues(graphKey);
      if (!currentGraph || connection.source === connection.target) {
        return false;
      }
      const sourceNode = currentGraph.nodes.find((n) => n.id === connection.source);
      const targetNode = currentGraph.nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) {
        return false;
      }
      const sourceHandle = connection.sourceHandle ?? 'exec';
      const targetHandle = connection.targetHandle ?? 'exec';

      // A source port is exec-flow if it's the default 'exec' output or one of the source
      // node's own declared branch ports (e.g. an 'if' node's 'then'/'else') - not just a
      // literal 'exec' string match, so branching action nodes work with zero special-casing.
      const sourceDef = resolveDef(sourceNode);
      const execPortIds = sourceDef?.execOutputs?.length ? sourceDef.execOutputs.map((p) => p.id) : ['exec'];
      const sourceIsExecPort = execPortIds.includes(sourceHandle);

      if (sourceIsExecPort || targetHandle === 'exec') {
        return (
          sourceIsExecPort &&
          targetHandle === 'exec' &&
          (sourceNode.kind === 'callback' || sourceNode.kind === 'action') &&
          targetNode.kind === 'action'
        );
      }
      // Data edges: the executor resolves operation-node outputs (computed) and callback-node
      // outputs (read live off the trigger payload/StreamMessage) - see EventGraphExecutor's
      // resolveNodeValues. Action-node outputs aren't wired up there yet, so those stay
      // unwireable.
      return sourceNode.kind === 'operation' || sourceNode.kind === 'callback';
    },
    [getValues, graphKey, resolveDef],
  );

  if (!graph) {
    return null;
  }

  const hasOscTrigger = (graph.nodes ?? []).some(
    (n) => n.moduleName === 'core' && n.nodeTypeId === 'osc_trigger',
  );

  return (
    <OscLiveValuesProvider enabled={hasOscTrigger}>
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '65vh',
        border: '1px solid var(--color-border, #444)',
        overflow: 'hidden',
      }}
    >
      <NodeGraphCanvas
        key={eventName}
        eventName={eventName}
        nodes={graph.nodes ?? []}
        edges={graph.edges ?? []}
        resolveDef={resolveDef}
        selectedNodeId={selectedNodeId}
        onSelectNode={setSelectedNodeId}
        onNodeDragEnd={handleNodeDragEnd}
        onNodeDelete={handleNodeDelete}
        onEdgeDelete={handleEdgeDelete}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onOpenContextMenu={setContextMenu}
      />
      <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 20 }}>
        <NodePalette groups={palette.groups} onSelect={(option) => palette.addNode(option)} />
      </div>
      {contextMenu ? (
        <NodeContextMenu
          anchor={contextMenu}
          groups={palette.groups}
          onSelect={palette.addNode}
          onDuplicateNode={handleNodeDuplicate}
          onDeleteNode={handleNodeDelete}
          onClose={() => setContextMenu(null)}
        />
      ) : null}
      {timerManagerOpen ? (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            bottom: 8,
            width: 320,
            zIndex: 21,
            overflowY: 'auto',
            background: 'var(--color-background-near, #242424)',
            border: '1px solid var(--color-border, #444)',
            borderRadius: 6,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <TimerManagerPanel onClose={() => setTimerManagerOpen(false)} />
        </div>
      ) : null}

      {selectedNodeId && inspectorHasContent && !timerManagerOpen ? (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            bottom: 8,
            width: 320,
            zIndex: 20,
            overflowY: 'auto',
            background: 'var(--color-background-near, #242424)',
            border: '1px solid var(--color-border, #444)',
            borderRadius: 6,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <div
            onClick={() => setSelectedNodeId('')}
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
            }}
          >
            ×
          </div>
          <NodeInspector
            eventName={eventName}
            selectedNodeId={selectedNodeId}
            onDeselect={() => setSelectedNodeId('')}
            onDeleteNode={handleNodeDelete}
          />
        </div>
      ) : null}
    </div>
    </OscLiveValuesProvider>
  );
}
