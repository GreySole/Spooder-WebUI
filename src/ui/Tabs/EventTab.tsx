import React from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventTableFormContextProvider from './EventsTab/context/EventTableFormContext';
import AddGroupInput from './EventsTab/eventCommand/input/AddGroupInput';
import { useState } from 'react';
import EventTable from './EventsTab/EventTable';
import LoadingCircle from '../Common/LoadingCircle';
import useEvents from '../../app/hooks/useEvents';
import DeleteGroupButton from './EventsTab/eventCommand/input/DeleteGroupButton';
import { FieldValues } from 'react-hook-form';
import SaveButton from '../Common/input/form/SaveButton';

export default function EventTab() {
  const { getEvents, getSaveEvents } = useEvents();
  const { events, groups, isLoading, error } = getEvents();
  const { saveEvents } = getSaveEvents();

  if (isLoading) {
    return <LoadingCircle />;
  }
  return (
    <EventTableFormContextProvider defaultEvents={events} defaultGroups={groups}>
      <EventTable />
      <AddGroupInput />
      <SaveButton saveFunction={saveEvents} />
    </EventTableFormContextProvider>
  );
}
