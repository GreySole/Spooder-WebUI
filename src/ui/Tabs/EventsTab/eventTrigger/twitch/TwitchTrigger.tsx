import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import TwitchTriggerType from './TwitchTriggerType';
import TwitchTriggerTypeReward from './TwitchTriggerTypeReward';
import { Box, FormBoolSwitch, Stack } from '@greysole/spooder-component-library';

interface TwitchTriggerProps {
  eventName: string;
}

export default function TwitchTrigger(props: TwitchTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();

  const twitchTriggerKey = buildTriggerKey(eventName, 'twitch');

  const enabledKey = buildKey(twitchTriggerKey, 'enabled');
  const enabled = watch(enabledKey, false);

  const typeKey = buildKey(twitchTriggerKey, 'type');
  const type = watch(typeKey, '');

  if (!enabled) {
    return (
      <Box width='100%' flexFlow='column'>
        <FormBoolSwitch label='Twitch:' formKey={enabledKey} />
      </Box>
    );
  }

  return (
    <Box width='100%' flexFlow='column'>
      <FormBoolSwitch label='Twitch:' formKey={enabledKey} />
      <Stack spacing='small' margin='small'>
        <TwitchTriggerType eventName={eventName} />
        {type === 'redeem' ? <TwitchTriggerTypeReward eventName={eventName} /> : null}
      </Stack>
    </Box>
  );
}
