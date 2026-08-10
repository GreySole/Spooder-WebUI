import React from 'react';
import { EventGraphNodeKind, NodePortDataType } from '../../../Types';
import { HANDLE_SPACING, HEADER_HEIGHT, NODE_WIDTH, TITLE_HEIGHT, computeNodePortLayout } from './canvas/nodeLayout';
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

const rowLabelStyle: React.CSSProperties = {
  position: 'absolute',
  height: HANDLE_SPACING,
  lineHeight: `${HANDLE_SPACING}px`,
  fontSize: '0.75rem',
  opacity: 0.8,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: NODE_WIDTH - 24,
};

export default function GraphNodeCard(props: GraphNodeCardProps) {
  const { id, kind, moduleName, nodeTypeId, def, selected, onSelect, onHeaderPointerDown, onStartConnection } = props;
  const label = def?.label ?? nodeTypeId;

  const { inputs, outputs } = computeNodePortLayout(kind, def);
  // Operation/callback outputs render as wireable sockets below (via computeNodePortLayout);
  // only action-node outputs (not resolved by the executor yet, so no socket exists for them)
  // fall back to plain read-only text.
  const readOnlyOutputs = kind === 'action' ? (def?.outputs ?? []) : [];
  // Named exec branches (an 'if' node's then/else) sit right at the top of the card, in the
  // same header/title band, by convention - so unlike data ports they can't be aligned to
  // their dot's `top` without overlapping the title. They keep the old normal-flow rendering.
  const execBranchRows = outputs.filter((p) => p.label);
  // Wireable data ports always sit below HANDLE_TOP_START (past the header/title), so their
  // label row is positioned at the exact same analytical `top` as their socket (rather than
  // left to stack in normal document flow) - a row and its dot always land on the same pixel
  // regardless of how many rows there are. Normal flow's per-row height depends on font
  // metrics and drifts out of sync with the sockets' fixed HANDLE_SPACING step after a few rows.
  const inputRows = inputs.filter((p) => p.dataType);
  const outputRows = outputs.filter((p) => p.dataType);
  const outputLabelByPortId = new Map((def?.outputs ?? []).map((o) => [o.id, o.label]));

  const maxPortTop = Math.max(HEADER_HEIGHT + TITLE_HEIGHT, ...inputs.map((p) => p.top), ...outputs.map((p) => p.top));

  return (
    <div
      onPointerDown={() => onSelect(id)}
      style={{
        position: 'relative',
        width: NODE_WIDTH,
        minHeight: maxPortTop + HANDLE_SPACING,
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
          height: HEADER_HEIGHT,
          boxSizing: 'border-box',
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
          height: TITLE_HEIGHT,
          boxSizing: 'border-box',
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

      {(readOnlyOutputs.length > 0 || execBranchRows.length > 0) && (
        <div style={{ padding: '0 8px 8px', fontSize: '0.75rem', opacity: 0.8 }}>
          {readOnlyOutputs.map((output) => (
            <div key={output.id}>out: {output.label} (not wireable)</div>
          ))}
          {execBranchRows.map((p) => (
            <div key={p.portId}>out: {p.label}</div>
          ))}
        </div>
      )}

      {inputRows.map((p) => {
        const fieldLabel = def?.form?.[p.portId]?.label ?? p.portId;
        return (
          <div key={p.portId} style={{ ...rowLabelStyle, top: p.top - HANDLE_SPACING / 2, left: 12 }}>
            in: {fieldLabel}
          </div>
        );
      })}
      {outputRows.map((p) => (
        <div
          key={p.portId}
          style={{
            ...rowLabelStyle,
            top: p.top - HANDLE_SPACING / 2,
            right: 12,
            textAlign: 'right',
          }}
        >
          out: {outputLabelByPortId.get(p.portId) ?? p.portId}
        </div>
      ))}

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
