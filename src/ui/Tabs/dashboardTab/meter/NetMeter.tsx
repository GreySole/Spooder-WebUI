import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Box from '../../../common/Box';
import { formatBytes } from '../../../common/Helpers';
import GraphMeter from './GraphMeter';

interface NetMeterProps {
  value: number;
  color: string;
  icon: any;
  graphData: number[];
  total: number;
}

export default function NetMeter(props: NetMeterProps) {
  const { value, graphData, icon, color, total } = props;
  console.log(graphData);
  return (
    <Box width='50%' margin='15px' flexFlow={'row'} alignItems={'center'} justifyContent='center'>
      <Box
        width='15%'
        height='200px'
        margin='0 10px 0 0'
        flexFlow={'column'}
        justifyContent='space-between'
      >
        <Box flexFlow='column' alignItems='center'>
          <FontAwesomeIcon icon={icon} size='2x' />
          {<h2>{formatBytes(value, 2)}</h2>}
        </Box>
        <Box flexFlow='column' alignItems='center'>
          <h2>Total</h2>
          <h2>{formatBytes(total, 2)}</h2>
        </Box>
      </Box>
      <GraphMeter data={graphData} width={400} height={200} color={color} />
    </Box>
  );
}
