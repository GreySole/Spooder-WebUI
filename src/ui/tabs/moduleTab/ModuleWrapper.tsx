import React from 'react';
import DiscordTab from '../../../modules/installed/discord/discordTab/DiscordTab';
import TwitchTab from '../../../modules/installed/twitch/twitchTab/TwitchTab';
interface ModuleWrapperProps {
  module: string;
}

export default function ModuleWrapper(props: ModuleWrapperProps) {
  const { module } = props;
  switch (module) {
    case 'twitch':
      return <TwitchTab />;
    case 'discord':
      return <DiscordTab />;
    default:
      return <div>Module '{module}' not found</div>;
  }
}
