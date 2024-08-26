import { ReactNode, createContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';

interface EventTableFormContextProviderProps {
  children: ReactNode;
}

export default function EventTableFormContextProvider(props: EventTableFormContextProviderProps) {
  const { children } = props;
  const { getEvents } = useEvents();
  const { events, groups, isLoading, error } = getEvents();

  const EventTableForm = useForm({
    defaultValues: {
      events: events,
      groups: groups,
    },
  });

  return <FormProvider {...EventTableForm}>{children}</FormProvider>;
}
