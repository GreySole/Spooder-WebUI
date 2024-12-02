import React from 'react';
import { ReactNode } from 'react';

interface BorderProps {
  children: ReactNode;
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderColor?: string;
  borderWidth?: string;
}

export default function Border(props: BorderProps) {
  const {
    children,
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderColor,
    borderWidth,
  } = props;

  return (
    <div
      className='border-component'
      style={{
        width: 'inherit',
        height: 'inherit',
        border,
        borderTop,
        borderRight,
        borderBottom,
        borderLeft,
        borderColor,
        borderWidth,
        borderStyle: 'solid',
      }}
    >
      {children}
    </div>
  );
}
