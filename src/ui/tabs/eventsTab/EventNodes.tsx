import {
    Connection,
    Edge,
    Handle,
    Node,
    NodeProps,
    Position,
    ReactFlow,
    addEdge,
    useEdgesState,
    useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useCallback } from 'react';

interface EventNodesProps {
  eventName: string;
}

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
];

function MyNode({ data }: NodeProps) {
  return (
    <div style={{ padding: 10, width: 150, border: '1px solid #555', borderRadius: 4 }}>
      {/* Input handle on the left */}
      <Handle type="target" position={Position.Left} id="input" />

      <span>{data.label as string}</span>

      {/* Output handle on the right */}
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

const nodeTypes = { myNode: MyNode };

const initialNodes: Node[] = [
  { id: '1', type: 'myNode', position: { x: 0, y: 0 }, data: { label: 'Event Source' } },
  { id: '2', type: 'myNode', position: { x: 200, y: 100 }, data: { label: 'Event Handler' } },
];

export default function EventNodes(props: EventNodesProps) {
  const { eventName } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  

  

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={(connection) =>
            connection.source !== connection.target // prevent self-loops
        }
        fitView
      />
    </div>
  );
}
