import React from 'react';
import EventTableFormContextProvider from './eventsTab/context/EventTableFormContext';
import AddGroupInput from './eventsTab/eventCommand/input/AddGroupInput';
import EventTable from './eventsTab/EventTable';
import CircleLoader from '../common/loader/CircleLoader';
import useEvents from '../../app/hooks/useEvents';
import SaveButton from '../common/input/form/SaveButton';
import Box from '../common/layout/Box';

export default function EventTab() {
  const { getEvents, getSaveEvents } = useEvents();
  const { events, groups, isLoading, error } = getEvents();
  const { saveEvents } = getSaveEvents();

  if (isLoading) {
    return <CircleLoader />;
  }
  return (
    <EventTableFormContextProvider defaultEvents={events} defaultGroups={groups}>
      <Box flexFlow='column' width='inherit'>
        <EventTable />
        <AddGroupInput />
        <SaveButton saveFunction={saveEvents} />
      </Box>
    </EventTableFormContextProvider>
  );
}
