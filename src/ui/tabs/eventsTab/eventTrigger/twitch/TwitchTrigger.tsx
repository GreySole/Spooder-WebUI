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

interface TwitchTriggerProps {
  eventName: string;
}

export default function TwitchTrigger(props: TwitchTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();
  const { getTestEventsub } = useTwitch();
  const [testArgs, setTestArgs] = useState<string>('');
  const {
    testEventsub,
    isLoading: isTesting,
    isSuccess: testSuccess,
    error: testError,
  } = getTestEventsub();

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
        <Box flexFlow='column' marginTop='small'>
          {type === 'redeem' ? (
            <TypeFace>Better to test this with your actual redeem.</TypeFace>
          ) : (
            <TypeFace>You can add extra arguments to the test by using the input below.</TypeFace>
          )}
          {type !== 'redeem' ? (
            <Box spacing='small' marginTop='small'>
              <TextInput
                value={testArgs}
                onChange={(value) => setTestArgs(value)}
                placeholder='Test Args'
              />
              <Button
                label='Test Trigger'
                onClick={() => {
                  testEventsub(type, testArgs);
                }}
              />
            </Box>
          ) : null}
        </Box>
      </Box>
    </Border>
  );
}
