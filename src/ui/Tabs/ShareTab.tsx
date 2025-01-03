import { CircleLoader, Stack, Box } from '@greysole/spooder-component-library';
import React from 'react';
import useShare from '../../app/hooks/useShare';
import ShareTabFormContextProvider from './ShareTab/context/ShareTabFormContext';
import ShareSaveButton from './ShareTab/input/ShareSaveButton';
import ShareEntry from './ShareTab/ShareEntry';

export default function ShareTab() {
  const { getShares } = useShare();
  const { data: shares, isLoading, error } = getShares();

  if (isLoading) {
    return <CircleLoader></CircleLoader>;
  }

  return (
    <ShareTabFormContextProvider shares={shares}>
      <Stack spacing='medium' width='100%'>
        <Box flexFlow='column' padding='small'>
          {Object.keys(shares).map((s: string) => {
            return <ShareEntry key={s} shareKey={s}></ShareEntry>;
          })}
        </Box>
        <ShareSaveButton />
      </Stack>
    </ShareTabFormContextProvider>
  );
}
