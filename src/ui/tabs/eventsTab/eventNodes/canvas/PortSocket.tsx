import React from 'react';
import { NodePortDataType } from '../../../../Types';
import { colorForPort, EXEC_COLOR } from './portColors';

// The dot as drawn, and the invisible square around it that takes the press. Splitting the two
// is what makes these usable on a tablet: the target is finger-sized without the canvas filling
// up with fat dots, and the dot stays small enough that adjacent branch ports (an 'if' node's
// then/else, one HANDLE_SPACING = 18px apart) still read as two separate dots.
//
// The hit box is kept to 24 rather than a full touch-target 44 because it necessarily overhangs
// the card - too large and pressing near a node's edge would grab a port instead of panning the
// canvas or dragging the card.
const DOT_SIZE = 14;
const HIT_SIZE = 24;

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
        // Centred on the card's edge whatever the sizes are, so the dot's middle lands exactly on
        // the point portGraphOffset() reports and edges meet their sockets.
        [side === 'in' ? 'left' : 'right']: -HIT_SIZE / 2,
        width: HIT_SIZE,
        height: HIT_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: side === 'out' ? 'crosshair' : connected ? 'grab' : 'default',
        transform: 'translateY(-50%)',
        zIndex: 2,
      }}
    >
      <div
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: '50%',
          background: color,
          border: '2px solid var(--color-background-near, #2a2a2a)',
          // The box around it is the target, including for a wire released nearby - dropping a
          // connection resolves through elementFromPoint, which has to land on the element
          // carrying data-socket-id rather than on this dot.
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
