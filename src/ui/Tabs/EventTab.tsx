import React from 'react';
import { EventTableModalProvider } from './eventsTab/context/EventTableModalContext';
import { CircleLoader, Box } from '@greysole/spooder-component-library';
import useEvents from '../../app/hooks/useEvents';
import EventTableFormContextProvider from './eventsTab/context/EventTableFormContext';
import EventTable from './eventsTab/EventTable';

export default function EventTab() {
  const { getEvents } = useEvents();
  const { events, groups, isLoading } = getEvents();

  if (isLoading) {
    return <CircleLoader />;
  }
  return (
    <EventTableFormContextProvider defaultEvents={events} defaultGroups={groups}>
      <EventTableModalProvider>
        <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)'>
          <EventTable />
        </Box>
      </EventTableModalProvider>
    </EventTableFormContextProvider>
  );
}
