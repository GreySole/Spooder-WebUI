import React from 'react';
import FormColorInput from '../../../common/input/form/FormColorInput';
import FormTextInput from '../../../common/input/form/FormTextInput';
import Stack from '../../../common/layout/Stack';

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
