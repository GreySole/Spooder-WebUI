import React from 'react';
import { ReactNode } from 'react';

interface BorderProps {
  children: ReactNode;
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
}

export default function Border(props: BorderProps) {
  const {
    children,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderColor = 'var(--button-border-color)',
    borderWidth = '1px',
    borderStyle = 'solid',
  } = props;

  const borderStyleValues =
    borderTop || borderRight || borderBottom || borderLeft
      ? {
          borderTop: borderTop ? `${borderWidth} ${borderStyle} ${borderColor}` : 'none',
          borderRight: borderRight ? `${borderWidth} ${borderStyle} ${borderColor}` : 'none',
          borderBottom: borderBottom ? `${borderWidth} ${borderStyle} ${borderColor}` : 'none',
          borderLeft: borderLeft ? `${borderWidth} ${borderStyle} ${borderColor}` : 'none',
        }
      : {
          borderTop: `${borderWidth} ${borderStyle} ${borderColor}`,
          borderRight: `${borderWidth} ${borderStyle} ${borderColor}`,
          borderBottom: `${borderWidth} ${borderStyle} ${borderColor}`,
          borderLeft: `${borderWidth} ${borderStyle} ${borderColor}`,
        };
  return (
    <div
      className='border-component'
      style={{
        width: 'inherit',
        height: 'inherit',
        ...borderStyleValues,
      }}
    >
      {children}
    </div>
  );
}
