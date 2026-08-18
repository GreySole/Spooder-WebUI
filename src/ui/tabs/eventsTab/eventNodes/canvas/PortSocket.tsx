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
  // Input sockets only: whether a wire currently lands here, i.e. whether grabbing this socket
  // will unhook something.
  connected?: boolean;
  onStartConnection?: (
    e: React.PointerEvent,
    nodeId: string,
    portId: string,
    dataType: NodePortDataType | undefined,
  ) => void;
  // Input sockets only. Returns whether a wire was actually taken off this socket; when it
  // wasn't, the event is left to bubble so the card underneath still starts a node drag.
  onDetachConnection?: (e: React.PointerEvent, nodeId: string, portId: string) => boolean;
}

export default function PortSocket(props: PortSocketProps) {
  const { nodeId, portId, side, top, dataType, label, connected, onStartConnection, onDetachConnection } = props;
  const color = dataType ? colorForPort(dataType) : EXEC_COLOR;

  return (
    <div
      data-socket-id={`${nodeId}:${portId}`}
      data-socket-side={side}
      title={label ?? dataType ?? 'exec'}
      onPointerDown={(e) => {
        // Left button only, and without swallowing the event otherwise: a middle press over a
        // socket is a pan gesture that has to reach the viewport underneath.
        if (e.button !== 0) {
          return;
        }
        if (side === 'in') {
          // Unhooking is a drag of the *existing* wire, so it reuses the same draft the
          // outputs start: the draft's origin becomes the wire's source port and the old edge
          // is dropped, leaving the user holding the loose end.
          if (onDetachConnection?.(e, nodeId, portId)) {
            e.stopPropagation();
          }
          return;
        }
        if (!onStartConnection) {
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
        cursor: side === 'out' ? 'crosshair' : connected ? 'grab' : 'default',
        transform: 'translateY(-50%)',
        zIndex: 2,
      }}
    />
  );
}
