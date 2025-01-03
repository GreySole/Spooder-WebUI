import { Stack, FormTextInput, FormColorInput } from '@greysole/spooder-component-library';
import React from 'react';

interface EditCustomSpooderInputPairProps {
  label: string;
  partName: string;
}

export default function EditCustomSpooderInputPair(props: EditCustomSpooderInputPairProps) {
  const { partName, label } = props;
  return (
    <Stack spacing='small'>
      <FormTextInput width='100px' formKey={`parts.${partName}`} label={label} />
      <FormColorInput formKey={`colors.${partName}`} />
    </Stack>
  );
}
