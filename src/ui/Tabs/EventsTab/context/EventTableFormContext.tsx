import React, { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface EventTableFormContextProviderProps {
  children: ReactNode;
  defaultEvents: any;
  defaultGroups: any;
}

export default function EventTableFormContextProvider(props: EventTableFormContextProviderProps) {
  const { children, defaultEvents, defaultGroups } = props;

  console.log('INIT EVENT CONTEXT', defaultEvents, defaultGroups);

  const EventTableForm = useForm({
    defaultValues: {
      events: defaultEvents,
      groups: defaultGroups,
    },
  });

  return <FormProvider {...EventTableForm}>{children}</FormProvider>;
}
