import React from 'react';
import useDiscord from '../../app/hooks/useDiscord';
import SaveButton from '../common/input/form/SaveButton';
import CircleLoader from '../common/loader/CircleLoader';
import DiscordConfig from './discordTab/input/DiscordConfig';
import DiscordLoginSettings from './discordTab/input/DiscordLoginSettings';
import DiscordTabFormContextProvider from './discordTab/context/DiscordTabFormContext';
import { useForm } from 'react-hook-form';

export default function DiscordTab() {
  const { getDiscordConfig, getSaveDiscordConfig } = useDiscord();
  const { data: discordData, isLoading: discordLoading, error: discordError } = getDiscordConfig();
  const { saveDiscordConfig } = getSaveDiscordConfig();
  if (discordLoading) {
    return <CircleLoader></CircleLoader>;
  }

  if (discordData == null) {
    return (
      <div className='config-variable'>
        Discord isn't logged in. Input your bot token and invite the bot to your server to assign a
        channel to auto send Ngrok links.
      </div>
    );
  }

  return (
    <div className='config-discord'>
      <DiscordTabFormContextProvider discordConfig={discordData}>
        <DiscordLoginSettings />
        <DiscordConfig />
        <SaveButton saveFunction={saveDiscordConfig} />
      </DiscordTabFormContextProvider>
    </div>
  );
}
