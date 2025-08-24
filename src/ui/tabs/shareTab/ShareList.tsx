import { Stack, Box } from '@greysole/spooder-component-library';
import React from 'react';
import { useShareTab } from './context/ShareTabContext';
import ShareEntry from './ShareEntry';

export default function ShareList() {
  const { shares } = useShareTab();
  return (
    <Stack spacing='medium' width='100%'>
      {Object.keys(shares).map((s: string) => {
        return (
          <Box flexFlow='column' padding='medium' key={s}>
            <ShareEntry shareKey={s} shareData={shares[s]} />
          </Box>
        );
      })}
    </Stack>
  );
}
