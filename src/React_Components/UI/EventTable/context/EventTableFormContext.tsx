import React, { ReactNode, createContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';
import LoadingCircle from '../../LoadingCircle';

interface EventTableFormContextProviderProps {
  children: ReactNode;
  defaultEvents: any;
  defaultGroups: any;
}

export default function EventTableFormContextProvider(props: EventTableFormContextProviderProps) {
  const { children, defaultEvents, defaultGroups } = props;

  const EventTableForm = useForm({
    defaultValues: {
      events: defaultEvents,
      groups: defaultGroups,
    },
  });

  return <FormProvider {...EventTableForm}>{children}</FormProvider>;
}
