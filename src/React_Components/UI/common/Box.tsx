import React from 'react';

interface BoxProps {
  padding: string;
  margin: string;
  flexFlow: string;
  alignItems: string;
  justifyContent: string;
  children: React.JSX.Element[];
}

export default function Box(props: BoxProps) {
  const { padding, margin, flexFlow, alignItems, justifyContent, children } = props;
  return (
    <div
      className='box'
      style={{
        display: 'flex',
        padding: padding,
        margin: margin,
        flexFlow: flexFlow,
        justifyContent: justifyContent,
        alignItems: alignItems,
      }}
    >
      {children}
    </div>
  );
}
