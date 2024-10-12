import React from 'react';
import { useFormContext } from 'react-hook-form';

interface TextAreaInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function TextAreaInput(props: TextAreaInputProps) {
  const { label, value, onChange } = props;
  return (
    <label htmlFor={`textarea-${label}`}>
      {label}
      <textarea id={`textarea-${label}`} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
