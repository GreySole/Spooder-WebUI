import React from 'react';
import EventTableFormContextProvider from './eventsTab/context/EventTableFormContext';
import EventTable from './eventsTab/EventTable';
import CircleLoader from '../common/loader/CircleLoader';
import useEvents from '../../app/hooks/useEvents';
import Box from '../common/layout/Box';
import { EventTableModalProvider } from './eventsTab/context/EventTableModalContext';

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
