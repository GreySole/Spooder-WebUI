import React, { useEffect } from 'react';
import { EventTableModalProvider } from './eventsTab/context/EventTableModalContext';
import { CircleLoader, Box, useToast } from '@spooder/webui-component-library';
import useEvents from '../../app/hooks/useEvents';
import EventTableFormContextProvider from './eventsTab/context/EventTableFormContext';
import PageCircleLoader from '../common/input/general/PageCircleLoader';

export default function EventTab() {
  const { getEvents } = useEvents();
  const { isLoading, graphs, error } = getEvents();
  const { showError } = useToast();

  // showError must run in an effect, not the render body: it calls setState on
  // ToastProvider, which recreates its context value every render and re-renders every
  // consumer (including this component, via useToast()) - calling it inline here re-fires
  // it on that re-render too, looping forever for as long as `error` stays truthy.
  useEffect(() => {
    if (error) {
      showError('Failed to fetch events');
    }
  }, [error]);

  // Also guard on `error`/missing `graphs`, not just `isLoading`: RTK Query's `isLoading`
  // is only true during the initial fetch, so a failed request leaves it `false` with
  // `graphs` still `undefined` - rendering the table then crashes on Object.keys(undefined).
  if (isLoading || error || graphs === undefined) {
    return <PageCircleLoader />;
  }
  return <EventTableModalProvider />;
}
