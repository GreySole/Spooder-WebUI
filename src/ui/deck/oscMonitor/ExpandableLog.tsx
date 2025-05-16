import {
  Border,
  Box,
  Columns,
  MouseArea,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { Log } from '../OSCMonitor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

interface ExpandableLogProps {
  log: Log;
}

export default function ExpandableLog(props: ExpandableLogProps) {
  const { log } = props;
  const [expanded, setExpanded] = useState(false);

  return (
    <Border>
      <MouseArea onClick={() => setExpanded(!expanded)}>
        <Box flexFlow='column'>
          <Box
            width='100%'
            flexFlow='row'
            justifyContent='space-between'
            alignItems='center'
            padding='small'
          >
            <Columns spacing='small'>
              <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretRight} />
              <TypeFace>{log.type}</TypeFace>
              <TypeFace>{log.direction}</TypeFace>
              <TypeFace>{log.address}</TypeFace>
            </Columns>
            <TypeFace whiteSpace='nowrap' textOverflow='ellipsis'>
              {log.args.toString()}
            </TypeFace>
          </Box>
          {expanded ? (
            <Stack spacing='small'>
              {log.args.map((arg, i) => (
                <TypeFace key={i}>{arg}</TypeFace>
              ))}
            </Stack>
          ) : null}
        </Box>
      </MouseArea>
    </Border>
  );
}
