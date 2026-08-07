import { Stack, Box, TypeFace } from '@spooder/webui-component-library';
import React from 'react';
import { useShareTab } from './context/ShareTabContext';
import ShareEntry from './ShareEntry';

export default function ShareList() {
  const { shares } = useShareTab();
  if (Object.keys(shares).length === 0) {
    return (
      <TypeFace>
        No shares available. Create a share by clicking Create Share at the bottom and enter a
        Twitch username.
      </TypeFace>
    );
  }

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
