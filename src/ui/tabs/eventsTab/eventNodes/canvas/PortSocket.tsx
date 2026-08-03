import React from 'react';
import { NodePortDataType } from '../../../../Types';
import { colorForPort, EXEC_COLOR } from './portColors';

export interface PortSocketProps {
  nodeId: string;
  portId: string;
  side: 'in' | 'out';
  top: number;
  dataType?: NodePortDataType;
  label?: string;
  onStartConnection?: (
    e: React.PointerEvent,
    nodeId: string,
    portId: string,
    dataType: NodePortDataType | undefined,
  ) => void;
}

export default function PortSocket(props: PortSocketProps) {
  const { nodeId, portId, side, top, dataType, label, onStartConnection } = props;
  const color = dataType ? colorForPort(dataType) : EXEC_COLOR;

  return (
    <div
      data-socket-id={`${nodeId}:${portId}`}
      data-socket-side={side}
      title={label ?? dataType ?? 'exec'}
      onPointerDown={(e) => {
        if (side !== 'out' || !onStartConnection) {
          return;
        }
        e.stopPropagation();
        onStartConnection(e, nodeId, portId, dataType);
      }}
      style={{
        position: 'absolute',
        top,
        [side === 'in' ? 'left' : 'right']: -6,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: color,
        border: '2px solid var(--color-background-near, #2a2a2a)',
        cursor: side === 'out' ? 'crosshair' : 'default',
        transform: 'translateY(-50%)',
        zIndex: 2,
      }}
    />
  );
}
