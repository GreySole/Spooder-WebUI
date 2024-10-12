import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface NumberInputProps {
  key?: string;
  label?: string;
  precision?: number;
  value: number;
  onInput: (value: number) => void;
}

export default function NumberInput(props: NumberInputProps) {
  const { key, label, precision, value, onInput } = props;

  function setPrecision(rawValue: string) {
    const value = parseFloat(rawValue);
    onInput(precision !== undefined ? parseFloat(value.toFixed(precision)) : value);
  }

  return (
    <label htmlFor={`number-${key}`}>
      {label}
      <input
        id={`number-${key}`}
        className='number-input'
        type='number'
        value={value}
        onInput={(e) => setPrecision((e.target as HTMLInputElement).value)}
      />
    </label>
  );
}
