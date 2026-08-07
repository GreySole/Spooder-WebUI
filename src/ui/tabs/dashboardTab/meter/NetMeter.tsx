import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import GraphMeter from './GraphMeter';
import { Box, formatBytes, useTheme } from '@spooder/webui-component-library';

interface NetMeterProps {
  value: number;
  color: string;
  icon: any;
  graphData: number[];
  total: number;
}

export default function NetMeter(props: NetMeterProps) {
  const { value, graphData, icon, color, total } = props;
  const { isMobileDevice } = useTheme();
  return (
    <Box
      width={isMobileDevice ? '100%' : '50%'}
      margin='medium'
      flexFlow='row'
      alignItems='center'
      justifyContent='center'
    >
      <Box
        width='20%'
        height='200px'
        marginRight='small'
        flexFlow={'column'}
        justifyContent='space-between'
      >
        <Box flexFlow='column' alignItems='center' textAlign='center'>
          <FontAwesomeIcon icon={icon} size='2x' />
          {<h3>{formatBytes(value, 2)}/s</h3>}
        </Box>
        <Box flexFlow='column' alignItems='center' textAlign='center'>
          <h2>Total</h2>
          <h3>{formatBytes(total, 2)}</h3>
        </Box>
      </Box>
      <GraphMeter data={graphData} width={400} height={200} color={color} />
    </Box>
  );
}
