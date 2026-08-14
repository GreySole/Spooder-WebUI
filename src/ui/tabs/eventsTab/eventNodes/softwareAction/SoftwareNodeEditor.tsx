import React from 'react';
import { Stack } from '@spooder/webui-component-library';
import SoftwareConflictCheck from './SoftwareConflictCheck';

interface SoftwareNodeEditorProps {
  eventName: string;
  nodeIndex: number;
}

// The OSC Send node's fields (address, destination, values, type, duration, priority) are
// edited inline on the node card from its form def - see CORE_ACTION_DEFS in coreNodeDefs.ts.
// Only the conflict warning lives here, since nothing in a form def can express it.
export default function SoftwareNodeEditor(props: SoftwareNodeEditorProps) {
  const { eventName, nodeIndex } = props;

  return (
    <Stack spacing='small'>
      <SoftwareConflictCheck eventName={eventName} nodeIndex={nodeIndex} />
    </Stack>
  );
}
