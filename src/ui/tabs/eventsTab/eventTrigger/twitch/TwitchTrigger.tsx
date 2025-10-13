import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import TwitchTriggerType from './TwitchTriggerType';
import TwitchTriggerTypeReward from './TwitchTriggerTypeReward';
import {
  Border,
  Box,
  Button,
  FormBoolSwitch,
  Stack,
  TextInput,
  TypeFace,
} from '@greysole/spooder-component-library';
import useTwitch from '../../../../../app/hooks/useTwitch';
import TwitchTriggerTest from './TwitchTriggerTest';

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
    <Border>
      <Box width='100%' flexFlow='column' padding='small'>
        <FormBoolSwitch label='Twitch:' formKey={enabledKey} />
        <Stack spacing='small' margin='small'>
          <TwitchTriggerType eventName={eventName} />
          {type === 'redeem' ? <TwitchTriggerTypeReward eventName={eventName} /> : null}
        </Stack>
        <TwitchTriggerTest twitchTriggerType={type} />
      </Box>
    </Border>
  );
}
