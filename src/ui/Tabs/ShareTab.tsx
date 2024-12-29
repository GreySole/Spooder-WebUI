import React from 'react';
import CircleLoader from '../common/loader/CircleLoader';
import useShare from '../../app/hooks/useShare';
import ShareTabFormContextProvider from './shareTab/context/ShareTabFormContext';
import ShareEntry from './shareTab/ShareEntry';
import ShareSaveButton from './shareTab/input/ShareSaveButton';
import Box from '../common/layout/Box';
import Stack from '../common/layout/Stack';

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
