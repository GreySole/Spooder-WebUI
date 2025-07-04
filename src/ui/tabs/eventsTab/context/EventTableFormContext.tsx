import React, { ReactNode, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useEventTableModal } from './EventTableModalContext';

interface EventTableFormContextProviderProps {
  children: ReactNode;
  defaultEvents: any;
  defaultGroups: any;
}

export default function EventTableFormContextProvider(props: EventTableFormContextProviderProps) {
  const { children, defaultEvents, defaultGroups } = props;
  const { resetFormRef } = useEventTableModal();

  const EventTableForm = useForm({
    defaultValues: {
      events: defaultEvents,
      groups: defaultGroups,
    },
  });

  // Expose the reset function to the modal context
  useEffect(() => {
    resetFormRef.current = EventTableForm.reset;
  }, [EventTableForm.reset, resetFormRef]);

  // Update form values when defaultEvents or defaultGroups change (after refetch)
  useEffect(() => {
    EventTableForm.reset({
      events: defaultEvents,
      groups: defaultGroups,
    });
  }, [defaultEvents, defaultGroups, EventTableForm]);

  return <FormProvider {...EventTableForm}>{children}</FormProvider>;
}
