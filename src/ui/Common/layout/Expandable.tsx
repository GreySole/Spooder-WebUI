import React, { ReactNode, useState } from 'react';
import Box from './Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import Columns from './Columns';
import TypeFace from './TypeFace';
import { StyleSize, StyleSizeType } from '../../Types';

interface ExpandableProps {
  label: string;
  children: ReactNode;
  fontSize?: StyleSizeType;
  forceOpen?: boolean;
}

export default function Expandable(props: ExpandableProps) {
  const { label, fontSize, forceOpen, children } = props;
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box classes={['expandable' + (open ? ' open' : '')]} flexFlow='column' padding='small'>
      <Columns spacing='medium' onClick={(e) => setOpen(!open)}>
        <TypeFace fontSize={fontSize ?? 'xlarge'} userSelect='none'>
          {label}
        </TypeFace>
        <FontAwesomeIcon icon={open || forceOpen ? faCaretUp : faCaretDown} size='lg' />
      </Columns>
      {open || forceOpen ? children : undefined}
    </Box>
  );
}
