import { FormSelectDropdown } from '@spooder/webui-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface ModTargetTypeProps {
  formKey: string;
}

export default function ModTargetType(props: ModTargetTypeProps) {
  const { formKey } = props;
  return (
    <FormSelectDropdown
      formKey={formKey}
      label='Target Type'
      options={[
        { value: 'all', label: 'Everything' },
        { value: 'event', label: 'Event' },
        { value: 'plugin', label: 'Plugin' },
      ]}
    />
  );
}
