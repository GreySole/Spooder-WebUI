import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useEvents from '../../../app/hooks/useEvents';
import { EventGraph, EventGraphEdge, EventGraphNode } from '../../Types';
import { buildGraphKey } from './FormKeys';
import NodeGraphCanvas from './eventNodes/canvas/NodeGraphCanvas';
import { PendingConnection, Point } from './eventNodes/canvas/types';
import NodeInspector from './eventNodes/NodeInspector';
import NodePalette from './eventNodes/NodePalette';
import { OscLiveValuesProvider } from './eventNodes/OscLiveValues';
import { resolveNodeDef } from './eventNodes/nodeDefLookup';

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
      setValue(`${graphKey}.edges`, [...currentGraph.edges, newEdge], { shouldDirty: true });
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
      />
      <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 20 }}>
        <NodePalette eventName={eventName} />
      </div>
      {selectedNodeId ? (
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
