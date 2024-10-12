import React from 'react';

interface RangeInputProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  showValue?: boolean;
  onChange: (value: number) => void;
}

export default function RangeInput(props: RangeInputProps) {
  const { label, min, max, step, value, showValue, onChange } = props;
  return (
    <label htmlFor={`range-${label}`}>
      {label}
      <input
        id={`range-${label}`}
        className='range-input'
        type='range'
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
      {showValue ? value : null}
    </label>
  );
}
