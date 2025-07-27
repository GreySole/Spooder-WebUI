import { CircleLoader, Stack, Box, SaveButton } from '@greysole/spooder-component-library';
import React from 'react';
import useShare from '../../app/hooks/useShare';
import ShareTabFormContextProvider from './shareTab/context/ShareTabFormContext';
import ShareSaveButton from './shareTab/input/ShareSaveButton';
import ShareEntry from './shareTab/ShareEntry';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import { Footer } from '../app/Footer';

export default function ShareTab() {
  const { getShares, getSaveShares } = useShare();
  const { saveShares } = getSaveShares();
  const { data: shares, isLoading, error } = getShares();

  if (isLoading) {
    return <PageCircleLoader />;
  }

  return (
    <ShareTabFormContextProvider shares={shares}>
      <Box width='100%' marginBottom='var(--footer-height)'>
        <Stack spacing='medium' width='100%'>
          {Object.keys(shares).map((s: string) => {
            return (
              <Box flexFlow='column' padding='medium'>
                <ShareEntry key={s} shareKey={s} />
              </Box>
            );
          })}
        </Stack>
      </Box>
      <Footer showFooter={true}>
        <SaveButton saveFunction={saveShares} />
      </Footer>
    </ShareTabFormContextProvider>
  );
}
