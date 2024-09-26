import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface ColorInputProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorInput(props: ColorInputProps) {
  const { label, value, onChange } = props;

  return (
    <label htmlFor={`color-${label}`}>
      {label}
      <input type='color' value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
