import React from 'react';
import { ReactNode } from 'react';

interface StackProps {
  children: ReactNode | ReactNode[];
  spacing: string;
}

export default function Stack(props: StackProps) {
  const { children, spacing } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing, width: '100%' }}>
      {children}
    </div>
  );
}
