import {
  Stack,
  FormTextInput,
  FormColorInput,
  TypeFace,
  Box,
} from '@greysole/spooder-component-library';
import React from 'react';

interface EditCustomSpooderInputPairProps {
  label: string;
  partName: string;
}

export default function EditCustomSpooderInputPair(props: EditCustomSpooderInputPairProps) {
  const { partName, label } = props;
  return (
    <Stack spacing='medium' margin='small'>
      <TypeFace>{label}</TypeFace>
      <FormTextInput width='100px' formKey={`parts.${partName}`} />
      <FormColorInput formKey={`colors.${partName}`} />
    </Stack>
  );
}
