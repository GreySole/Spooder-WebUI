import React from 'react';
import TwitchTab from '../TwitchTab';
import DiscordTab from '../DiscordTab';

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
