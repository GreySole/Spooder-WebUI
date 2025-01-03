import React from 'react';
import { KeyedObject } from '../../Types';
import CircleMeter from './meter/CircleMeter';
import { Box } from '@greysole/spooder-component-library';

interface DiskMetersProps {
  diskUsage: KeyedObject[];
}

export default function DiskMeters(props: DiskMetersProps) {
  const { diskUsage } = props;
  return (
    <Box flexFlow={'column'} alignItems={'center'} justifyContent={'center'}>
      <h1>Disk</h1>
      <Box flexFlow={'row wrap'} alignItems={'center'} justifyContent={'center'}>
        {diskUsage.map((disk: KeyedObject) => {
          return (
            <CircleMeter
              key={disk.label}
              label={disk.label}
              value={disk.used}
              min={0}
              max={disk.total}
              showMax
              formatByteData
            />
          );
        })}
      </Box>
    </Box>
  );
}
