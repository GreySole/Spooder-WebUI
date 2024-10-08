import React from 'react';
import FormColorInput from '../../common/input/form/FormColorInput';
import FormTextInput from '../../common/input/form/FormTextInput';

interface EditCustomSpooderInputPairProps {
  label: string;
  partName: string;
}

export default function EditCustomSpooderInputPair(props: EditCustomSpooderInputPairProps) {
  const { partName, label } = props;
  return (
    <div className='custom-spooder-pair'>
      <FormTextInput formKey={`parts.${partName}`} label={label} />
      <FormColorInput formKey={`colors.${partName}`} />
    </div>
  );
}
