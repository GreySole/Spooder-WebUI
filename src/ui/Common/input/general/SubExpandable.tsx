import React, { ReactNode, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Box, TypeFace, Columns } from '@greysole/spooder-component-library';

interface ExpandableProps {
  label: string;
  triggerIcons?: ReactNode;
  children: ReactNode;
}

export default function SubExpandable(props: ExpandableProps) {
  const { label, triggerIcons, children } = props;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box className={`expandable event ${open ? 'open' : ''}`} marginTop='small' flexFlow='column'>
      <Box
        className='expandable-header'
        justifyContent='space-between'
        alignItems='center'
        padding='medium'
        onClick={() => setOpen(!open)}
      >
        <TypeFace fontSize='large'>
          <Columns spacing='medium'>
            {label} {triggerIcons}
          </Columns>
        </TypeFace>

        {open ? <FontAwesomeIcon icon={faX} size='2x' /> : null}
      </Box>

      {open ? (
        <Box paddingLeft='medium' paddingBottom='medium'>
          {children}
        </Box>
      ) : null}
    </Box>
  );
}
