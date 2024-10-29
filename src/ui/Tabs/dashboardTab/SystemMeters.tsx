import React from 'react';
import Box from '../../common/Box';
import CircleMeter from './meter/CircleMeter';
import { KeyedObject } from '../../Types';

interface SystemMetersProps {
  cpuUsage: number;
  ramUsage: KeyedObject;
}

export default function SystemMeters(props: SystemMetersProps) {
  const { cpuUsage, ramUsage } = props;
  return (
    <Box flexFlow={'column'} alignItems={'center'} justifyContent={'center'}>
      <h1>System</h1>
      <Box alignItems={'center'} justifyContent={'center'}>
        <CircleMeter label='CPU' value={Math.round(cpuUsage)} min={0} max={100} unit='%' />
        <CircleMeter
          label='RAM'
          value={ramUsage.used}
          min={0}
          max={ramUsage.total}
          showMax
          formatByteData
        />
      </Box>
    </Box>
  );
}
