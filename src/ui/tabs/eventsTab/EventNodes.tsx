import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useEvents from '../../../app/hooks/useEvents';
import { EventGraph, EventGraphEdge, EventGraphNode } from '../../Types';
import { buildGraphKey } from './FormKeys';
import NodeGraphCanvas from './eventNodes/canvas/NodeGraphCanvas';
import { ContextMenuAnchor, PendingConnection, Point } from './eventNodes/canvas/types';
import GraphSidePanel, { useGraphPanelWidth } from './eventNodes/GraphSidePanel';
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

  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  // The inspector edits one node, so it only opens on a single selection - a box-selected group
  // has no one node to show.
  const selectedNodeId = selectedNodeIds.length === 1 ? selectedNodeIds[0] : '';
  const [timerManagerOpen, setTimerManagerOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuAnchor | null>(null);

  // One palette tree, rendered by both the corner buttons and the canvas context menu.
  const palette = useNodePalette({ eventName, onManageTimers: () => setTimerManagerOpen(true) });
  // Most nodes are edited entirely on their card, so their panel would open with nothing in it.
  const inspectorHasContent = useInspectorHasContent(eventName, selectedNodeId);
  const [panelWidth, setPanelWidth, persistPanelWidth] = useGraphPanelWidth();

  // A right click on a node that's part of the current selection acts on the whole selection;
  // on any other node, just that one.
  const contextMenuNodeIds = !contextMenu?.nodeId
    ? []
    : selectedNodeIds.includes(contextMenu.nodeId)
      ? selectedNodeIds
      : [contextMenu.nodeId];

  const graphKey = buildGraphKey(eventName);
  const graph: EventGraph = watch(graphKey);

  const resolveDef = useCallback(
    (node: Pick<EventGraphNode, 'kind' | 'moduleName' | 'nodeTypeId' | 'values'>) =>
      resolveNodeDef(node, manifests, operationNodes),
    [manifests, operationNodes],
  );

  // One form update for the whole drag, however many nodes moved in it.
  const handleNodesDragEnd = useCallback(
    (positions: Map<string, Point>) => {
      const currentGraph: EventGraph = getValues(graphKey);
      const nextNodes = currentGraph.nodes.map((n) => {
        const position = positions.get(n.id);
        return position ? { ...n, position } : n;
      });
      setValue(`${graphKey}.nodes`, nextNodes, { shouldDirty: true });
    },
    [getValues, graphKey, setValue],
  );

  // A resize touches one node, but goes through the same whole-array setValue as a drag: the
  // form holds `nodes` as one value, so there is no narrower key to write.
  const handleNodeResizeEnd = useCallback(
    (nodeId: string, width: number) => {
      const currentGraph: EventGraph = getValues(graphKey);
      const nextNodes = currentGraph.nodes.map((n) => (n.id === nodeId ? { ...n, width } : n));
      setValue(`${graphKey}.nodes`, nextNodes, { shouldDirty: true });
    },
    [getValues, graphKey, setValue],
  );

  // Dropping the override entirely rather than writing the default back, so the card follows its
  // node type's declared width from then on - including a later change to it.
  const handleNodeResetWidth = useCallback(
    (nodeId: string) => {
      const currentGraph: EventGraph = getValues(graphKey);
      if (!currentGraph.nodes.some((n) => n.id === nodeId && n.width !== undefined)) {
        return;
      }
      const nextNodes = currentGraph.nodes.map((n) => {
        if (n.id !== nodeId) {
          return n;
        }
        const { width, ...rest } = n;
        return rest as EventGraphNode;
      });
      setValue(`${graphKey}.nodes`, nextNodes, { shouldDirty: true });
    },
    [getValues, graphKey, setValue],
  );

  const handleNodesDelete = useCallback(
    (nodeIds: string[]) => {
      const doomed = new Set(nodeIds);
      const currentGraph: EventGraph = getValues(graphKey);
      const remainingNodes = currentGraph.nodes.filter((n) => !doomed.has(n.id));
      const remainingEdges = currentGraph.edges.filter(
        (e) => !doomed.has(e.fromNode) && !doomed.has(e.toNode),
      );
      setValue(`${graphKey}.nodes`, remainingNodes, { shouldDirty: true });
      setValue(`${graphKey}.edges`, remainingEdges, { shouldDirty: true });
      setSelectedNodeIds((current) => current.filter((id) => !doomed.has(id)));
    },
    [getValues, graphKey, setValue],
  );

  const handleNodesDuplicate = useCallback(
    (nodeIds: string[]) => {
      const wanted = new Set(nodeIds);
      const currentGraph: EventGraph = getValues(graphKey);
      const copies = currentGraph.nodes
        .filter((n) => wanted.has(n.id))
        .map((source) => ({
          ...source,
          id: uuidv4(),
          // Deep copy so the two nodes don't share nested value objects (an OSC trigger's arg
          // labels, a condition group) - react-hook-form edits those in place, which would
          // otherwise edit both nodes at once.
          values: JSON.parse(JSON.stringify(source.values ?? {})),
          // Offset rather than dropped at the cursor: copies land beside their originals
          // instead of directly on top of them, keeping the group's shape.
          position: { x: source.position.x + 30, y: source.position.y + 30 },
        })) as EventGraphNode[];
      if (copies.length === 0) {
        return;
      }
      setValue(`${graphKey}.nodes`, [...currentGraph.nodes, ...copies], { shouldDirty: true });
      // Wires aren't copied, so the new nodes are selected as the thing to hook up next.
      setSelectedNodeIds(copies.map((n) => n.id));
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
      className='node-graph-root'
      style={{
        position: 'relative',
        width: '100%',
        // Fills the modal page instead of taking a fixed slice of the viewport - see the
        // `.modal-body:has(.node-graph-root)` rule in EventTab.scss, which is what gives this
        // flex item a height to grow into. The floor keeps the canvas usable on a short window,
        // where the modal body scrolls instead.
        flex: '1 1 auto',
        minHeight: 300,
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
        selectedNodeIds={selectedNodeIds}
        onSelectNodes={setSelectedNodeIds}
        onNodesDragEnd={handleNodesDragEnd}
        onNodeResizeEnd={handleNodeResizeEnd}
        onNodeResetWidth={handleNodeResetWidth}
        onNodesDelete={handleNodesDelete}
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
          nodeActionIds={contextMenuNodeIds}
          onDuplicateNodes={handleNodesDuplicate}
          onDeleteNodes={handleNodesDelete}
          onClose={() => setContextMenu(null)}
        />
      ) : null}
      {timerManagerOpen ? (
        <GraphSidePanel
          width={panelWidth}
          onResize={setPanelWidth}
          onResizeEnd={persistPanelWidth}
          zIndex={21}
        >
          <TimerManagerPanel onClose={() => setTimerManagerOpen(false)} />
        </GraphSidePanel>
      ) : null}

      {selectedNodeId && inspectorHasContent && !timerManagerOpen ? (
        <GraphSidePanel
          width={panelWidth}
          onResize={setPanelWidth}
          onResizeEnd={persistPanelWidth}
          zIndex={20}
          onClose={() => setSelectedNodeIds([])}
        >
          <NodeInspector
            eventName={eventName}
            selectedNodeId={selectedNodeId}
            onDeselect={() => setSelectedNodeIds([])}
            onDeleteNode={(nodeId) => handleNodesDelete([nodeId])}
          />
        </GraphSidePanel>
      ) : null}
    </div>
    </OscLiveValuesProvider>
  );
}
