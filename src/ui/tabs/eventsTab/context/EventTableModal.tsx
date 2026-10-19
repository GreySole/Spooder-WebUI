import { MultiPageModal } from '@spooder/webui-component-library';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import EventGeneral from '../EventGeneral';
import EventSaveButton from '../EventSaveButton';
import { useEventTableModal } from './EventTableModalContext';
import { EventNodes, NodeGraphHostProvider } from '@spooder/webui-node-graph';
import mainNodeGraphHost from '../mainNodeGraphHost';
import EventStorage from '../eventStorage/EventStorage';
import { buildGraphKey, buildKey } from '../FormKeys';

function EventTableModal() {
  const { eventName, isOpen, cancel } = useEventTableModal();
  const { watch } = useFormContext();
  // The event's display name (EventGeneral's Name field) rather than eventName, which is its
  // internal key - watched, not read once, so renaming it updates the title immediately rather
  // than on the next open. Falls back to the internal key for an event with no display name set.
  const displayName = watch(buildKey(buildGraphKey(eventName), 'name'));

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
      title={displayName || eventName}
      pages={pages}
      headerContent={<EventSaveButton />}
      isOpen={isOpen}
      onClose={cancel}
    />
  );
}

export default React.memo(EventTableModal);
