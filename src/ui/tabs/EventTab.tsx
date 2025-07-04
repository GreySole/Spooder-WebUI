import React from 'react';
import { EventTableModalProvider } from './eventsTab/context/EventTableModalContext';
import { CircleLoader, Box } from '@greysole/spooder-component-library';
import useEvents from '../../app/hooks/useEvents';
import EventTableFormContextProvider from './eventsTab/context/EventTableFormContext';
import PageCircleLoader from '../common/input/general/PageCircleLoader';

export default function EventTab() {
  const { getEvents } = useEvents();
  const { events, groups, isLoading } = getEvents();

  if (isLoading) {
    return <PageCircleLoader />;
  }
  return <EventTableModalProvider />;
}
