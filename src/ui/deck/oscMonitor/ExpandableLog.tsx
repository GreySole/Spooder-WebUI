import {
  Border,
  Box,
  Columns,
  MouseArea,
  Stack,
  TypeFace,
  useTheme,
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
  const { isMobileDevice } = useTheme();

  function getLogArgs(log: Log) {
    if (Array.isArray(log.args)) {
      return log.args.map((arg, i) => <TypeFace key={i}>{arg}</TypeFace>);
    } else {
      try {
        const obj = JSON.parse(log.args);
        return Object.keys(obj).map((key, i) => (
          <TypeFace key={key}>{`'${key}' : ${obj[key]}`}</TypeFace>
        ));
      } catch (e) {
        return <TypeFace>{log.args}</TypeFace>;
      }
    }
  }

  return (
    <Box flexFlow='column'>
      <Border>
        <MouseArea onClick={() => setExpanded(!expanded)}>
          <Box
            width='100%'
            flexFlow={isMobileDevice ? 'column' : 'row'}
            justifyContent='space-between'
            alignItems='center'
            padding='small'
          >
            <Columns width={isMobileDevice ? '100%' : '50%'} spacing='small'>
              <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretRight} />
              <TypeFace>{log.type}</TypeFace>
              <TypeFace>{log.direction}</TypeFace>
              <TypeFace truncate>{log.address}</TypeFace>
            </Columns>
            <TypeFace width={isMobileDevice ? '100%' : '50%'} truncate>
              {log.args.toString()}
            </TypeFace>
          </Box>
          {expanded ? (
            <Stack spacing='small' padding='small'>
              {getLogArgs(log)}
            </Stack>
          ) : null}
        </MouseArea>
      </Border>
    </Box>
  );
}
