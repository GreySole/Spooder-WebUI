import { CircleLoader, Stack, Box } from '@greysole/spooder-component-library';
import React from 'react';
import useShare from '../../app/hooks/useShare';
import ShareTabFormContextProvider from './shareTab/context/ShareTabFormContext';
import ShareSaveButton from './shareTab/input/ShareSaveButton';
import ShareEntry from './shareTab/ShareEntry';

export default function ShareTab() {
  const { getShares } = useShare();
  const { data: shares, isLoading, error } = getShares();

  if (isLoading) {
    return <CircleLoader></CircleLoader>;
  }

  return (
    <ShareTabFormContextProvider shares={shares}>
      <Stack spacing='medium' width='100%'>
        {Object.keys(shares).map((s: string) => {
          return (
            <Box flexFlow='column' padding='medium'>
              <ShareEntry key={s} shareKey={s} />
            </Box>
          );
        })}
      </Stack>
    </ShareTabFormContextProvider>
  );
}
