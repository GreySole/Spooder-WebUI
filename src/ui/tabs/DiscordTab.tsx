import React from 'react';
import useDiscord from '../../app/hooks/useDiscord';
import DiscordConfig from './discordTab/input/DiscordConfig';
import DiscordLoginSettings from './discordTab/input/DiscordLoginSettings';
import DiscordTabFormContextProvider from './discordTab/context/DiscordTabFormContext';
import {
  Box,
  CircleLoader,
  SaveButton,
  Stack,
  TypeFace,
} from '@spooder/webui-component-library';
import PageCircleLoader from '../common/input/general/PageCircleLoader';
import DiscordAuthTutorial from './discordTab/DiscordAuthTutorial';

export default function DiscordTab() {
  const { getDiscordConfig, getSaveDiscordConfig } = useDiscord();
  const {
    data: discordData,
    isLoading: discordLoading,
    error: discordError,
    refetch,
  } = getDiscordConfig();
  const { saveDiscordConfig } = getSaveDiscordConfig();
  if (discordLoading) {
    return <PageCircleLoader />;
  }

  const handleSaveDiscordConfig = (form: any) => {
    saveDiscordConfig(form).then(() => {
      refetch();
    });
  };

  return (
    <Stack width='100%' spacing='medium' padding='medium'>
      <DiscordTabFormContextProvider discordConfig={discordData}>
        <DiscordLoginSettings />
        {discordData.master && discordData.token && discordData.clientId ? (
          <DiscordConfig />
        ) : (
          <DiscordAuthTutorial />
        )}
        <Box justifyContent='flex-end'>
          <SaveButton saveFunction={handleSaveDiscordConfig} />
        </Box>
      </DiscordTabFormContextProvider>
    </Stack>
  );
}
