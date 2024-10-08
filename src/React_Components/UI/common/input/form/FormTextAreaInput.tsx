import React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormTextAreaInputProps {
  formKey: string;
  label?: string;
}

export default function FormTextAreaInput(props: FormTextAreaInputProps) {
  const { formKey, label } = props;
  const { register, watch } = useFormContext();
  const value = watch(formKey, '');
  return (
    <label htmlFor={`textarea-${formKey}`}>
      {label}
      <textarea id={`textarea-${formKey}`} value={value} {...register(formKey)} />
    </label>
  );
}
