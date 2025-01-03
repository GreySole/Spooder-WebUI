import { useState } from 'react';
import ModuleWrapper from './moduleTab/ModuleWrapper';
import React from 'react';
import { Box, Button } from '@greysole/spooder-component-library';
import TwitchIcon from '@greysole/spooder-component-library/dist/types/icons/TwitchIcon';
import DiscordIcon from '@greysole/spooder-component-library/dist/types/icons/DiscordIcon';

export default function ModuleTab() {
  const [module, setModule] = useState('');
  const modules = {
    stream: {
      twitch: {
        name: 'Twitch',
        icon: TwitchIcon,
      },
    },
    community: {
      discord: {
        name: 'Discord',
        icon: DiscordIcon,
      },
    },
  };

  const resetModuleSelection = () => {
    setModule('');
  };

  return module === '' ? (
    <Box
      width='100%'
      flexFlow='row'
      alignItems='center'
      justifyContent='space-evenly'
      padding='medium'
    >
      <Button
        label={modules.stream.twitch.name}
        icon={modules.stream.twitch.icon}
        iconSize='100px'
        onClick={() => setModule('twitch')}
        iconPosition='bottom'
      />
      <Button
        label={modules.community.discord.name}
        icon={modules.community.discord.icon}
        iconSize='100px'
        onClick={() => setModule('discord')}
        iconPosition='bottom'
      />
    </Box>
  ) : (
    <Box flexFlow='column'>
      <Button label='Back' onClick={resetModuleSelection} />
      <ModuleWrapper module={module} />
    </Box>
  );
}
