import React, { ReactNode, useState } from 'react';
import Columns from '../../../common/layout/Columns';
import Box from '../../../common/layout/Box';
import { StyleSize } from '../../../Types';

interface ExpandableProps {
  label: string;
  triggerIcons?: ReactNode;
  children: React.JSX.Element;
}

export default function EventExpandable(props: ExpandableProps) {
  const { label, triggerIcons, children } = props;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box
      classes={['expandable', 'event', open ? 'open' : '']}
      marginLeft='medium'
      marginTop='small'
      flexFlow='column'
    >
      <label
        className='expandable-label'
        onClick={() => setOpen(!open)}
        style={{ padding: StyleSize.medium }}
      >
        <Columns spacing='small'>
          {label} {triggerIcons}
        </Columns>
      </label>
      {open ? children : null}
    </Box>
  );
}
