import React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormRangeInputProps {
  formKey: string;
  label?: string;
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
}

export default function FormRangeInput(props: FormRangeInputProps) {
  const { formKey, label, min, max, step, showValue } = props;
  const { register, watch } = useFormContext();
  const value = watch(formKey, min);
  return (
    <label htmlFor={`range-${formKey}`}>
      {label}
      <input
        id={`range-${formKey}`}
        className='range-input'
        type='range'
        min={min}
        max={max}
        step={step}
        {...register(formKey, { valueAsNumber: true })}
      />
      {showValue ? value : null}
    </label>
  );
}
