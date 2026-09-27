import { FormSelectDropdown } from '@spooder/webui-component-library';
import React from 'react';

interface ModNodeTargetTypeProps {
  formKey: string;
}

export default function ModNodeTargetType(props: ModNodeTargetTypeProps) {
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
