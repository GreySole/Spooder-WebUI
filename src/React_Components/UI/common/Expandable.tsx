import React, { ReactNode, useState } from 'react';

interface ExpandableProps {
  label: string;
  children: ReactNode;
}

export default function Expandable(props: ExpandableProps) {
  const { label, children } = props;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className='expandable'>
      <label className='expandable-label' onClick={(e) => setOpen(!open)}>
        {label}
      </label>
      {open ? children : null}
    </div>
  );
}
