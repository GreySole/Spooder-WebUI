import React from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventTableFormContextProvider from './eventsTab/context/EventTableFormContext';
import AddGroupInput from './eventsTab/eventCommand/input/AddGroupInput';
import { useState } from 'react';
import EventTable from './eventsTab/EventTable';
import LoadingCircle from '../common/LoadingCircle';
import useEvents from '../../app/hooks/useEvents';
import DeleteGroupButton from './eventsTab/eventCommand/input/DeleteGroupButton';
import { FieldValues } from 'react-hook-form';
import SaveButton from '../common/input/form/SaveButton';

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
