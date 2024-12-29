import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Box from '../../../common/layout/Box';
import { formatBytes } from '../../../util/DataUtil';
import GraphMeter from './GraphMeter';
import useTheme from '../../../../app/hooks/useTheme';

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
      flexFlow={'row'}
      alignItems={'center'}
      justifyContent='center'
    >
      <Box
        width='15%'
        height='200px'
        marginRight='small'
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
