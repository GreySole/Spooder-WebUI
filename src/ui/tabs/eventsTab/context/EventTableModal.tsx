import { MultiPageModal } from '@spooder/webui-component-library';
import React, { useMemo } from 'react';
import EventGeneral from '../EventGeneral';
import EventSaveButton from '../EventSaveButton';
import { useEventTableModal } from './EventTableModalContext';
import { EventNodes, NodeGraphHostProvider } from '@spooder/webui-node-graph';
import mainNodeGraphHost from '../mainNodeGraphHost';
import EventStorage from '../eventStorage/EventStorage';

function EventTableModal() {
  const { eventName, isOpen, cancel } = useEventTableModal();

  const pages = useMemo(
    () => [
      {
        title: 'General',
        content: <EventGeneral eventName={eventName} />,
      },
      {
        title: 'Nodes',
        content: (
          <NodeGraphHostProvider host={mainNodeGraphHost}>
            <EventNodes eventName={eventName} />
          </NodeGraphHostProvider>
        ),
      },
      { title: 'Storage', content: <EventStorage eventName={eventName} /> },
    ],
    [eventName],
  );

  return (
    <MultiPageModal
      title={eventName}
      pages={pages}
      headerContent={<EventSaveButton />}
      isOpen={isOpen}
      onClose={cancel}
    />
  );
}

export default React.memo(EventTableModal);
