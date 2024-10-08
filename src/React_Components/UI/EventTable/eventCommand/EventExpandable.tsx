import React, { ReactNode, useState } from 'react';

interface ExpandableProps {
  label: string;
  triggerIcons: ReactNode[];
  children: React.JSX.Element;
}

export default function EventExpandable(props: ExpandableProps) {
  const { label, triggerIcons, children } = props;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className='expandable event'>
      <label className='expandable-label' onClick={() => setOpen(!open)}>
        <h1>
          {label}
          {triggerIcons}
        </h1>
      </label>
      {open ? children : null}
    </div>
  );
}
