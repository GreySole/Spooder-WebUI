import React from 'react';
import EventTableFormContextProvider from './eventsTab/context/EventTableFormContext';
import AddGroupInput from './eventsTab/eventCommand/input/AddGroupInput';
import EventTable from './eventsTab/EventTable';
import CircleLoader from '../common/loader/CircleLoader';
import useEvents from '../../app/hooks/useEvents';
import SaveButton from '../common/input/form/SaveButton';

export default function EventTab() {
  const { getEvents, getSaveEvents } = useEvents();
  const { events, groups, isLoading, error } = getEvents();
  const { saveEvents } = getSaveEvents();

  if (isLoading) {
    return <CircleLoader />;
  }
  return (
    <EventTableFormContextProvider defaultEvents={events} defaultGroups={groups}>
      <EventTable />
      <AddGroupInput />
      <SaveButton saveFunction={saveEvents} />
    </EventTableFormContextProvider>
  );
}
