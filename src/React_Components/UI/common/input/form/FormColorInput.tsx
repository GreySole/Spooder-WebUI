import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface TextInputProps {
  formKey: string;
  label?: string;
}

export default function FormColorInput(props: TextInputProps) {
  const { formKey, label } = props;
  const { watch, register } = useFormContext();
  const value = watch(formKey);
  
  return (
    <label htmlFor={`color-${formKey}`}>
      {label}
      <input type="color" value={value} {...register(formKey)} />
    </label>
  );
}
