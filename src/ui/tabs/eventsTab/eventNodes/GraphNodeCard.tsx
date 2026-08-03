import React from 'react';
import { EventGraphNodeKind, NodePortDataType } from '../../../Types';
import { NODE_WIDTH, computeNodePortLayout } from './canvas/nodeLayout';
import PortSocket from './canvas/PortSocket';
import { ResolvedNodeDef } from './nodeDefLookup';

export interface GraphNodeCardProps {
  id: string;
  kind: EventGraphNodeKind;
  moduleName: string;
  nodeTypeId: string;
  def?: ResolvedNodeDef;
  selected: boolean;
  onSelect: (nodeId: string) => void;
  onHeaderPointerDown: (e: React.PointerEvent<HTMLDivElement>, nodeId: string) => void;
  onStartConnection: (
    e: React.PointerEvent,
    nodeId: string,
    portId: string,
    dataType: NodePortDataType | undefined,
  ) => void;
}

const KIND_COLOR: { [key in EventGraphNodeKind]: string } = {
  callback: '#8e44ad',
  action: '#2980b9',
  operation: '#16a085',
};

export default function GraphNodeCard(props: GraphNodeCardProps) {
  const { id, kind, moduleName, nodeTypeId, def, selected, onSelect, onHeaderPointerDown, onStartConnection } = props;
  const label = def?.label ?? nodeTypeId;

  const { inputs, outputs } = computeNodePortLayout(kind, def);
  const readOnlyOutputs = kind !== 'operation' ? (def?.outputs ?? []) : [];
  const execBranches = outputs.filter((p) => p.label);

  return (
    <div
      onPointerDown={() => onSelect(id)}
      style={{
        position: 'relative',
        width: NODE_WIDTH,
        borderRadius: 6,
        border: `2px solid ${selected ? '#f1c40f' : KIND_COLOR[kind]}`,
        background: 'var(--color-background-near, #2a2a2a)',
        color: 'var(--color-text, #eee)',
        boxShadow: selected ? '0 0 8px rgba(241, 196, 15, 0.6)' : 'none',
      }}
    >
      <div
        onPointerDown={(e) => onHeaderPointerDown(e, id)}
        style={{
          background: KIND_COLOR[kind],
          padding: '4px 8px',
          borderRadius: '4px 4px 0 0',
          fontSize: '0.7rem',
          opacity: 0.85,
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        {moduleName}
      </div>
      <div
        style={{
          padding: '8px',
          fontWeight: 'bold',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={label}
      >
        {label}
      </div>

      {(inputs.some((p) => p.dataType) || readOnlyOutputs.length > 0 || execBranches.length > 0) && (
        <div style={{ padding: '0 8px 8px', fontSize: '0.75rem', opacity: 0.8 }}>
          {inputs
            .filter((p) => p.dataType)
            .map((p) => {
              const fieldLabel = def?.form?.[p.portId]?.label ?? p.portId;
              return <div key={p.portId}>in: {fieldLabel}</div>;
            })}
          {readOnlyOutputs.map((output) => (
            <div key={output.id}>out: {output.label} (not wireable)</div>
          ))}
          {execBranches.map((p) => (
            <div key={p.portId}>out: {p.label}</div>
          ))}
        </div>
      )}

      {inputs.map((p) => (
        <PortSocket key={`in:${p.portId}`} nodeId={id} portId={p.portId} side='in' top={p.top} dataType={p.dataType} />
      ))}
      {outputs.map((p) => (
        <PortSocket
          key={`out:${p.portId}`}
          nodeId={id}
          portId={p.portId}
          side='out'
          top={p.top}
          dataType={p.dataType}
          label={p.label}
          onStartConnection={onStartConnection}
        />
      ))}
    </div>
  );
}
