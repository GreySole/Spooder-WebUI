import { useState } from 'react';
import ModuleWrapper from './moduleTab/ModuleWrapper';
import React from 'react';
import { Box, Button, Stack } from '@greysole/spooder-component-library';
import { DiscordIcon, TwitchIcon } from '../common/icons/icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
    >
      <Button
        label={modules.stream.twitch.name}
        icon={modules.stream.twitch.icon}
        iconSize='100px'
        fontSize='large'
        onClick={() => setModule('twitch')}
        iconPosition='bottom'
      />

      <Button
        label={modules.community.discord.name}
        icon={modules.community.discord.icon}
        iconSize='100px'
        fontSize='large'
        onClick={() => setModule('discord')}
        iconPosition='bottom'
      />
    </Box>
  ) : (
    <Stack spacing='medium' width='100%'>
      <Box>
        <Button
          label='Back'
          icon={faArrowLeft}
          iconPosition='left'
          onClick={resetModuleSelection}
        />
      </Box>
      <ModuleWrapper module={module} />
    </Stack>
  );
}
