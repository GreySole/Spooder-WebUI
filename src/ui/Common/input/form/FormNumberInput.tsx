import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface NumberInputProps {
  formKey: string;
  label?: string;
  precision?: number;
}

export default function FormNumberInput(props: NumberInputProps) {
  const { formKey, label, precision } = props;
  const { watch, register } = useFormContext();
  const value = watch(formKey);

  function setPrecision(value: number) {
    return precision !== undefined ? value.toFixed(precision) : value;
  }

  return (
    <label htmlFor={`number-${formKey}`}>
      {label}
      <input
        id={`number-${formKey}`}
        className='number-input'
        type='number'
        value={value}
        {...register(formKey, { valueAsNumber: true, setValueAs: setPrecision })}
      />
    </label>
  );
}
