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
    (node: Pick<EventGraphNode, 'kind' | 'moduleName' | 'nodeTypeId'>) => resolveNodeDef(node, manifests, operationNodes),
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
      if (sourceHandle === 'exec' || targetHandle === 'exec') {
        return (
          sourceHandle === 'exec' &&
          targetHandle === 'exec' &&
          (sourceNode.kind === 'callback' || sourceNode.kind === 'action') &&
          targetNode.kind === 'action'
        );
      }
      // Data edges: the executor only ever resolves operation-node sources today.
      return sourceNode.kind === 'operation';
    },
    [getValues, graphKey],
  );

  if (!graph) {
    return null;
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '65vh', border: '1px solid var(--color-border, #444)' }}>
      <div style={{ width: 220, overflowY: 'auto', borderRight: '1px solid var(--color-border, #444)' }}>
        <NodePalette eventName={eventName} />
      </div>
      <div style={{ flex: 1 }}>
        <NodeGraphCanvas
          key={eventName}
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
      </div>
      <div style={{ width: 300, overflowY: 'auto', borderLeft: '1px solid var(--color-border, #444)' }}>
        <NodeInspector
          eventName={eventName}
          selectedNodeId={selectedNodeId}
          onDeselect={() => setSelectedNodeId('')}
          onDeleteNode={handleNodeDelete}
        />
      </div>
    </div>
  );
}
