import React, { ReactNode, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useEventTableModal } from './EventTableModalContext';

interface EventTableFormContextProviderProps {
  children: ReactNode;
  defaultGraphs: any;
  defaultGroups: any;
  defaultDisabledGroups: any;
}

export default function EventTableFormContextProvider(props: EventTableFormContextProviderProps) {
  const { children, defaultGraphs, defaultGroups, defaultDisabledGroups } = props;
  const { resetFormRef } = useEventTableModal();

  const EventTableForm = useForm({
    defaultValues: {
      graphs: defaultGraphs,
      groups: defaultGroups,
      disabledGroups: defaultDisabledGroups,
    },
  });

  // Expose the reset function to the modal context
  useEffect(() => {
    resetFormRef.current = EventTableForm.reset;
  }, [EventTableForm.reset, resetFormRef]);

  // Update form values when defaults change (after refetch)
  useEffect(() => {
    EventTableForm.reset({
      graphs: defaultGraphs,
      groups: defaultGroups,
      disabledGroups: defaultDisabledGroups,
    });
  }, [defaultGraphs, defaultGroups, defaultDisabledGroups, EventTableForm]);

  return <FormProvider {...EventTableForm}>{children}</FormProvider>;
}
