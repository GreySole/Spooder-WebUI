import { Box, Stack, TypeFace } from '@greysole/spooder-component-library';
import React from 'react';
import AutoShareSwitch from '../input/AutoShareSwitch';
import ShareDiscordForm from '../input/ShareDiscordForm';

interface ShareIntegrationTabProps {
  shareKey: string;
}

export default function ShareIntegrationTab(props: ShareIntegrationTabProps) {
  const { shareKey } = props;
  return (
    <Stack spacing='medium' padding='small'>
      <TypeFace fontSize='large'>Twitch</TypeFace>
      <Stack spacing='small' padding='small'>
        <AutoShareSwitch shareKey={shareKey} />
      </Stack>
      <Stack spacing='small' padding='small'>
        <TypeFace fontSize='large'>Discord</TypeFace>
        <Box>
          <ShareDiscordForm shareKey={shareKey} />
        </Box>
      </Stack>
    </Stack>
  );
}
