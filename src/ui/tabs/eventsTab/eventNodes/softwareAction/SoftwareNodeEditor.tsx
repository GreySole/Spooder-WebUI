import React from 'react';
import { Stack } from '@spooder/webui-component-library';
import UdpServerManager from '../../../../common/udp/UdpServerManager';
import SoftwareConflictCheck from './SoftwareConflictCheck';

interface SoftwareNodeEditorProps {
  eventName: string;
  nodeIndex: number;
}

// The OSC Send node's fields (address, destination, values, type, duration, priority) are
// edited inline on the node card from its form def - see CORE_ACTION_DEFS in coreNodeDefs.ts.
// What lives here is what no form def can express: the conflict warning, and the destination
// list behind the card's Destination dropdown, so a new UDP server can be added without
// leaving the graph for the config tab.
export default function SoftwareNodeEditor(props: SoftwareNodeEditorProps) {
  const { eventName, nodeIndex } = props;

  return (
    <Stack spacing='small'>
      <SoftwareConflictCheck eventName={eventName} nodeIndex={nodeIndex} />
      <UdpServerManager />
    </Stack>
  );
}
