import React from 'react';
import useEvents from '../../../../app/hooks/useEvents';
import { FormSelectDropdown } from '@greysole/spooder-component-library';

interface FormEventSelectProps {
  formKey: string;
  label?: string;
}

export default function FormEventSelect(props: FormEventSelectProps) {
  const { formKey, label } = props;
  const { getEvents } = useEvents();
  const { graphs, isLoading, error } = getEvents();
  const eventOptions = [{ label: 'None', value: '' }];

  if (isLoading || error) {
    return null;
  }

  for (let e in graphs) {
    eventOptions.push({
      label: graphs[e].name,
      value: e,
    });
  }

  return <FormSelectDropdown formKey={formKey} label={label} options={eventOptions} />;
}
