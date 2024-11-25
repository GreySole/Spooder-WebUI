import React from 'react';
import { ReactNode } from 'react';

interface ColumnsProps {
  children: ReactNode | ReactNode[];
  spacing: string;
}

export default function Columns(props: ColumnsProps) {
  const { children, spacing } = props;
  return <div style={{ display: 'flex', flexDirection: 'row', gap: spacing }}>{children}</div>;
}
